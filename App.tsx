import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Domino, GameState, Difficulty, Player, GameMode, AIDifficulty, Language } from './types';
import { generateDominoes } from './services/geminiService';
import { calculateHandScore, canPlayMove } from './utils';
import { useLanguage } from './context/LanguageContext';

// Import Components
import GameSetup from './components/GameSetup';
import PlayerHandDisplay from './components/PlayerHandDisplay';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameOverScreen from './components/GameOverScreen';
import RulesModal from './components/RulesModal';


// --- MAIN APP COMPONENT ---

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('pvc');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('hard');
  const [boardTiles, setBoardTiles] = useState<Domino[]>([]);
  const [player1Hand, setPlayer1Hand] = useState<Domino[]>([]);
  const [player2Hand, setPlayer2Hand] = useState<Domino[]>([]);
  const [heap, setHeap] = useState<Domino[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [selectedHandTile, setSelectedHandTile] = useState<Domino | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [drawCountThisTurn, setDrawCountThisTurn] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [playableTileIds, setPlayableTileIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // FIX: Cast translation result to string to match state type.
    setMessage(t('initialMessage') as string);
  }, [t]);

  const boardEnds = useMemo(() => {
    if (boardTiles.length === 0) return { startValue: null, endValue: null };
    const first = boardTiles[0];
    const last = boardTiles[boardTiles.length - 1];
    const startValue = first.flipped ? first.displayAnswer : first.solution;
    const endValue = last.flipped ? last.solution : last.displayAnswer;
    return { startValue, endValue };
  }, [boardTiles]);

  const handleNewGame = useCallback(async (difficulty: Difficulty, mode: GameMode, aiDifficulty: AIDifficulty) => {
    setGameState('loading');
    setGameMode(mode);
    if(mode === 'pvc') {
        setAiDifficulty(aiDifficulty);
    }
    setError(null);
    // FIX: Cast translation result to string to match state type.
    setMessage(t('loadingMessage') as string);
    setWinner(null);
    setConsecutivePasses(0);
    setBoardTiles([]);
    setPlayer1Hand([]);
    setPlayer2Hand([]);
    setDrawCountThisTurn(0);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setPlayableTileIds(new Set());

    try {
      const generatedData = await generateDominoes(difficulty, language);
      const allDominoes: Domino[] = generatedData
        .map((d, i) => ({ ...d, id: i, flipped: false }))
        .sort(() => Math.random() - 0.5);

      if (allDominoes.length > 11) {
        setBoardTiles([allDominoes[0]]);
        setPlayer1Hand(allDominoes.slice(1, 6));
        setPlayer2Hand(allDominoes.slice(6, 11));
        setHeap(allDominoes.slice(11));
        setCurrentPlayer('player1');
        setGameState('playing');
        // FIX: Cast translation result to string to match state type.
        setMessage(t('player1Turn') as string);
      } else {
        throw new Error("Not enough dominoes generated.");
      }
    } catch (err) {
      // FIX: Cast translation result to string to match state type.
      setError(t('startGameError') as string);
      setGameState('setup');
      // FIX: Cast translation result to string to match state type.
      setMessage(t('startGameError') as string);
    }
  }, [language, t]);

  const switchTurn = useCallback(() => {
    setSelectedHandTile(null);
    setDrawCountThisTurn(0);
    const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    setCurrentPlayer(nextPlayer);
    const p2Name = (gameMode === 'pvc' ? t('computerHandTitle') : t('player2HandTitle')) as string;
    const nextPlayerName = (nextPlayer === 'player1' ? t('player1HandTitle') : p2Name) as string;
    // FIX: Cast translation result to string to match state type.
    setMessage(t('playerTurn', nextPlayerName) as string);
  }, [currentPlayer, gameMode, t]);

  const handleSelectHandTile = (tile: Domino) => {
    if (gameState !== 'playing') return;
    const activePlayer = currentPlayer === 'player1' ? player1Hand : player2Hand;
    if(!activePlayer.some(t => t.id === tile.id)) return;

    if(gameMode === 'pvc' && currentPlayer === 'player2') return;
    
    setSelectedHandTile(prev => (prev?.id === tile.id ? null : tile));
  };

  const handlePlaceTile = useCallback((end: 'start' | 'end') => {
    const activeHand = currentPlayer === 'player1' ? player1Hand : player2Hand;
    if (!selectedHandTile || !activeHand.find(t => t.id === selectedHandTile.id)) return;

    const { startValue, endValue } = boardEnds;
    let match = false;
    let newTile = { ...selectedHandTile };

    if (end === 'start') {
        if (selectedHandTile.solution === startValue) { 
            newTile.flipped = true; match = true; 
        } else if (selectedHandTile.displayAnswer === startValue) { 
            newTile.flipped = false; match = true; 
        }
    } else { // 'end'
        if (selectedHandTile.solution === endValue) { 
            newTile.flipped = false; match = true; 
        } else if (selectedHandTile.displayAnswer === endValue) { 
            newTile.flipped = true; match = true; 
        }
    }

    if (match) {
      const updatedBoard = end === 'start' ? [newTile, ...boardTiles] : [...boardTiles, newTile];
      const updatedHand = activeHand.filter(t => t.id !== selectedHandTile.id);

      setBoardTiles(updatedBoard);
      if (currentPlayer === 'player1') setPlayer1Hand(updatedHand);
      else setPlayer2Hand(updatedHand);
      
      setError(null);
      setConsecutivePasses(0);

      if (updatedHand.length === 0) {
        setGameState('gameOver');
        setWinner(currentPlayer);
        const p2Name = (gameMode === 'pvc' ? t('computerHandTitle') : t('player2HandTitle')) as string;
        const winnerName = (currentPlayer === 'player1' ? t('player1HandTitle') : p2Name) as string;
        // FIX: Cast translation result to string to match state type.
        setMessage(t('playerWins', winnerName) as string);
      } else {
        switchTurn();
      }
    } else {
      // FIX: Cast translation result to string to match state type.
      setError(t('notAMatch') as string);
      setTimeout(() => setError(null), 2000);
      setSelectedHandTile(null);
    }
  }, [selectedHandTile, boardTiles, player1Hand, player2Hand, currentPlayer, switchTurn, gameMode, boardEnds, t]);

  const handleDrawTile = () => {
    if (heap.length === 0 || drawCountThisTurn >= 3) {
      // FIX: Cast translation result to string to match state type.
      setMessage(t('cannotDraw') as string);
      return;
    }
    const tileToDraw = heap[0];
    const newHeap = heap.slice(1);
    if (currentPlayer === 'player1') {
      setPlayer1Hand([...player1Hand, tileToDraw]);
    } else {
      setPlayer2Hand([...player2Hand, tileToDraw]);
    }
    setHeap(newHeap);
    setDrawCountThisTurn(c => c + 1);
    const p2Name = (gameMode === 'pvc' ? t('computerHandTitle') : t('player2HandTitle')) as string;
    const playerName = (currentPlayer === 'player1' ? t('player1HandTitle') : p2Name) as string;
    // FIX: Cast translation result to string to match state type.
    setMessage(t('playerDrewTile', playerName) as string);
  };

  const handlePassTurn = () => {
    setConsecutivePasses(p => p + 1);
    switchTurn();
  };
  
  const handleComputerTurn = useCallback(async () => {
    // FIX: Cast translation result to string to match state type.
    setMessage(t('computerThinking') as string);

    const maxDraws = {
      easy: 1,
      normal: 2,
      hard: 3,
    }[aiDifficulty];
    
    const findMove = (hand: Domino[]) => {
        for (const tile of hand) {
            if (tile.solution === boardEnds.startValue) return { tile, end: 'start' as const };
            if (tile.displayAnswer === boardEnds.startValue) return { tile, end: 'start' as const };
            if (tile.solution === boardEnds.endValue) return { tile, end: 'end' as const };
            if (tile.displayAnswer === boardEnds.endValue) return { tile, end: 'end' as const };
        }
        return null;
    };
    
    let move = findMove(player2Hand);
    let currentHeap = [...heap];
    let currentHand = [...player2Hand];
    let draws = 0;

    while (!move && currentHeap.length > 0 && draws < maxDraws) {
        draws++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        const tileToDraw = currentHeap.shift()!;
        currentHand.push(tileToDraw);
        setPlayer2Hand([...currentHand]);
        setHeap([...currentHeap]);
        // FIX: Cast translation result to string to match state type.
        setMessage(t('computerDrewTile', draws, maxDraws) as string);
        move = findMove(currentHand);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    if (move) {
        // FIX: Cast translation result to string to match state type.
        setMessage(t('computerPlays') as string);
        setSelectedHandTile(move.tile);
        setTimeout(() => handlePlaceTile(move!.end), 100);
    } else {
        // FIX: Cast translation result to string to match state type.
        setMessage(t('computerPasses') as string);
        handlePassTurn();
    }
  }, [player2Hand, heap, boardEnds, handlePlaceTile, handlePassTurn, aiDifficulty, t]);

  // Effect to update scores whenever a hand changes
  useEffect(() => {
    setPlayer1Score(calculateHandScore(player1Hand));
    setPlayer2Score(calculateHandScore(player2Hand));
  }, [player1Hand, player2Hand]);
  
  const isPlayerTurn = (gameMode === 'pvp' && (currentPlayer === 'player1' || currentPlayer === 'player2')) || (gameMode === 'pvc' && currentPlayer === 'player1');

  // Effect to calculate and highlight playable tiles for the current human player
  useEffect(() => {
    if (isPlayerTurn) {
        const newPlayableIds = new Set<number>();
        const hand = currentPlayer === 'player1' ? player1Hand : player2Hand;
        const { startValue, endValue } = boardEnds;
        if (startValue !== null && endValue !== null) {
            hand.forEach(tile => {
                if (tile.solution === startValue || tile.displayAnswer === startValue ||
                    tile.solution === endValue || tile.displayAnswer === endValue) {
                    newPlayableIds.add(tile.id);
                }
            });
        }
        setPlayableTileIds(newPlayableIds);
    } else {
        setPlayableTileIds(new Set()); // Clear highlights for computer's turn
    }
  }, [currentPlayer, player1Hand, player2Hand, boardEnds, isPlayerTurn]);

  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'player2' && gameMode === 'pvc') {
        const timer = setTimeout(handleComputerTurn, 2000);
        return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, gameMode, handleComputerTurn]);

  useEffect(() => {
    if (consecutivePasses >= 2) {
      setGameState('gameOver');
      const p1Score = calculateHandScore(player1Hand);
      const p2Score = calculateHandScore(player2Hand);
      setPlayer1Score(p1Score);
      setPlayer2Score(p2Score);

      // FIX: Cast translation result to string.
      const p2Name = (gameMode === 'pvc' ? t('computerHandTitle') : t('player2HandTitle')) as string;
      // FIX: Cast translation result to string to allow concatenation.
      let endMessage = t('gameBlocked', p1Score, p2Score, p2Name) as string;
      if (p1Score < p2Score) {
        setWinner('player1');
        // FIX: Cast translation result to string for concatenation.
        endMessage += t('player1WinsLowScore') as string;
      } else if (p2Score < p1Score) {
        setWinner('player2');
        // FIX: Cast translation result to string for concatenation.
        endMessage += t('player2WinsLowScore', p2Name) as string;
      } else {
        setWinner(null); // Draw
        // FIX: Cast translation result to string for concatenation.
        endMessage += t('drawGame') as string;
      }
      // FIX: The `endMessage` is now guaranteed to be a string, fixing the type error.
      setMessage(endMessage);
    }
  }, [consecutivePasses, player1Hand, player2Hand, gameMode, t]);

  const currentPlayerHand = currentPlayer === 'player1' ? player1Hand : player2Hand;
  const canCurrentPlayerPlay = useMemo(() => canPlayMove(currentPlayerHand, boardEnds), [currentPlayerHand, boardEnds]);


  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 selection:bg-[#feeba0] selection:text-black">
      <header className="w-full max-w-7xl flex justify-between items-center my-4">
        {/* FIX: Cast translation result to string to fix type error. */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#f76201]">{t('appTitle') as string}</h1>
        <div className="flex gap-2">
            <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-lg font-semibold ${language === 'en' ? 'bg-[#f76201] text-white' : 'bg-black/30'}`}>EN</button>
            <button onClick={() => setLanguage('ua')} className={`px-4 py-2 rounded-lg font-semibold ${language === 'ua' ? 'bg-[#f76201] text-white' : 'bg-black/30'}`}>UA</button>
        </div>
      </header>

      <main className="w-full max-w-7xl flex-grow flex flex-col items-center gap-4">
        {(gameState === 'setup' || gameState === 'loading') && <GameSetup onStartGame={handleNewGame} isLoading={gameState === 'loading'} onShowRules={() => setIsRulesModalOpen(true)} />}
        
        {gameState === 'loading' && <div className="text-center p-4 bg-black/30 rounded-lg font-semibold">{message}</div>}

        {error && <div className="w-full text-center p-3 bg-red-500/80 rounded-lg font-semibold animate-pulse">{error}</div>}
        
        {gameState === 'gameOver' && (
           <GameOverScreen message={message} onPlayAgain={() => setGameState('setup')} />
        )}

        {(gameState === 'playing' || gameState === 'gameOver') && (
          <>
            <PlayerHandDisplay 
              hand={player2Hand} 
              title={gameMode === 'pvc' ? t('computerHandTitle') as string : t('player2HandTitle') as string} 
              isCurrentPlayer={currentPlayer === 'player2'}
              isComputer={gameMode === 'pvc'}
              onTileClick={handleSelectHandTile}
              selectedTileId={selectedHandTile?.id ?? null}
              score={player2Score}
              playableTileIds={new Set()}
            />

            <GameBoard
              tiles={boardTiles}
              showStartButton={!!selectedHandTile && isPlayerTurn}
              showEndButton={!!selectedHandTile && isPlayerTurn}
              onPlaceStart={() => handlePlaceTile('start')}
              onPlaceEnd={() => handlePlaceTile('end')}
            />
            
            <GameControls
              heapCount={heap.length}
              message={message}
              isPlayerTurn={isPlayerTurn}
              canPlayerPlay={canCurrentPlayerPlay}
              drawCountThisTurn={drawCountThisTurn}
              onShowRules={() => setIsRulesModalOpen(true)}
              onDrawTile={handleDrawTile}
              onPassTurn={handlePassTurn}
            />

            <PlayerHandDisplay 
              hand={player1Hand} 
              title={t('player1HandTitle') as string} 
              isCurrentPlayer={currentPlayer === 'player1'}
              isComputer={false}
              onTileClick={handleSelectHandTile}
              selectedTileId={selectedHandTile?.id ?? null}
              score={player1Score}
              playableTileIds={playableTileIds}
            />
          </>
        )}
      </main>
      <footer className="text-center text-[#f76201]/70 py-4 mt-auto">
        {/* FIX: Cast translation result to string to fix type error. */}
        <p>{t('footerText') as string}</p>
      </footer>

      <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />
    </div>
  );
}