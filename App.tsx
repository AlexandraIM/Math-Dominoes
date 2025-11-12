
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Domino, GameState, Difficulty, Player, GameMode } from './types';
import { generateDominoes } from './services/geminiService';

// --- HELPER COMPONENTS ---

const DominoTile: React.FC<{
  domino: Domino;
  onClick?: () => void;
  isSelected?: boolean;
  isOnBoard?: boolean;
}> = ({ domino, onClick, isSelected, isOnBoard }) => {
  const { problem, displayAnswer, flipped } = domino;
  const leftValue = flipped ? displayAnswer : problem;
  const rightValue = flipped ? problem : displayAnswer;

  const baseClasses = "flex h-16 w-40 md:h-20 md:w-48 rounded-lg shadow-lg border-2 transition-all duration-200 ease-in-out font-bold shrink-0";
  const stateClasses = isOnBoard
    ? "bg-[#d41e00] border-[#f76201]/50 text-[#feeba0]" // Scarlet BG, Mimosa text
    : "bg-[#feeba0] border-[#feeba0]/50 cursor-pointer hover:bg-[#feeba0]/80 text-black"; // Mimosa BG, black text
  const selectedClasses = isSelected ? "ring-4 ring-[#f76201] scale-105 shadow-xl" : "";

  return (
    <div className={`${baseClasses} ${stateClasses} ${selectedClasses}`} onClick={onClick}>
      <div className="w-1/2 flex items-center justify-center text-center text-xs md:text-base break-words border-r-2 border-black/30 p-1">{leftValue}</div>
      <div className="w-1/2 flex items-center justify-center text-center text-lg md:text-xl break-words p-1">{rightValue}</div>
    </div>
  );
};

const PlayerHandDisplay: React.FC<{
  hand: Domino[];
  title: string;
  isCurrentPlayer: boolean;
  isComputer: boolean;
  onTileClick: (tile: Domino) => void;
  selectedTileId: number | null;
}> = ({ hand, title, isCurrentPlayer, isComputer, onTileClick, selectedTileId }) => {
  return (
    <div className="bg-black/20 p-4 rounded-xl shadow-inner min-h-[140px] w-full">
      <h2 className="text-lg font-semibold text-[#f76201] mb-4 text-center">{title} {isCurrentPlayer && <span className="text-[#feeba0]">(Current Turn)</span>}</h2>
      {hand.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {hand.map((tile) => (
            isComputer ? // Always show computer hand facedown
              <div key={tile.id} className="h-16 w-40 md:h-20 md:w-48 rounded-lg bg-black/40 border-2 border-[#f76201]/40 shadow-md"></div> :
              <DominoTile
                key={tile.id}
                domino={tile}
                onClick={() => onTileClick(tile)}
                isSelected={selectedTileId === tile.id}
              />
          ))}
        </div>
      ) : <p className="text-center text-[#f76201]/70">No tiles left!</p>}
    </div>
  );
}

const GameSetup: React.FC<{
  onStartGame: (difficulty: Difficulty, mode: GameMode) => void,
  isLoading: boolean
}> = ({ onStartGame, isLoading }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('pvc');

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-black/30 rounded-2xl shadow-2xl flex flex-col gap-6 text-center">
      <h2 className="text-3xl font-bold text-[#f76201]">Game Setup</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="difficulty" className="block font-semibold text-[#f76201] mb-2">Difficulty:</label>
          <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full bg-black/30 text-white rounded-md p-3 border-2 border-[#f76201]/50 focus:ring-2 focus:ring-[#f76201] focus:outline-none">
            <option value="easy">Easy</option>
            <option value="easy+">Easy+</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-[#f76201] mb-2">Game Mode:</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => setMode('pvc')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvc' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>vs. Computer</button>
            <button onClick={() => setMode('pvp')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvp' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>vs. Player</button>
          </div>
        </div>
      </div>
      <button onClick={() => onStartGame(difficulty, mode)} disabled={isLoading} className="w-full px-6 py-4 bg-[#f76201] text-white font-bold rounded-lg shadow-md hover:bg-[#f76201]/80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg">
        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : "Start Game"}
      </button>
    </div>
  );
};


// --- UTILITY FUNCTIONS ---

const canPlayMove = (hand: Domino[], boardEnds: { startValue: number | null, endValue: number | null }): boolean => {
    // FIX: Removed reference to `boardTiles` which is not in scope here.
    // The check for null boardEnds covers the case where the board is empty.
    if (boardEnds.startValue === null || boardEnds.endValue === null) return true;
    for (const tile of hand) {
        if (tile.solution === boardEnds.startValue || tile.displayAnswer === boardEnds.startValue ||
            tile.solution === boardEnds.endValue || tile.displayAnswer === boardEnds.endValue) {
            return true;
        }
    }
    return false;
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('pvc');
  const [boardTiles, setBoardTiles] = useState<Domino[]>([]);
  const [player1Hand, setPlayer1Hand] = useState<Domino[]>([]);
  const [player2Hand, setPlayer2Hand] = useState<Domino[]>([]);
  const [heap, setHeap] = useState<Domino[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player1');
  const [selectedHandTile, setSelectedHandTile] = useState<Domino | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Select game mode and difficulty to start.");
  const [consecutivePasses, setConsecutivePasses] = useState(0);

  const boardEnds = useMemo(() => {
    if (boardTiles.length === 0) return { startValue: null, endValue: null };
    const first = boardTiles[0];
    const last = boardTiles[boardTiles.length - 1];
    // Left value of the first tile
    const startValue = first.flipped ? first.displayAnswer : first.solution;
    // Right value of the last tile
    const endValue = last.flipped ? last.solution : last.displayAnswer;
    return { startValue, endValue };
  }, [boardTiles]);

  const handleNewGame = useCallback(async (difficulty: Difficulty, mode: GameMode) => {
    setGameState('loading');
    setGameMode(mode);
    setError(null);
    setMessage("Generating your unique domino set...");
    setWinner(null);
    setConsecutivePasses(0);
    setBoardTiles([]);
    setPlayer1Hand([]);
    setPlayer2Hand([]);

    try {
      const generatedData = await generateDominoes(difficulty);
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
        setMessage("Player 1's turn. Match the expressions to the answers!");
      } else {
        throw new Error("Not enough dominoes generated.");
      }
    } catch (err) {
      setError("Could not start a new game. Please try again.");
      setGameState('setup');
      setMessage("Failed to start game. Check your connection or API key.");
    }
  }, []);

  const switchTurn = useCallback(() => {
    setSelectedHandTile(null);
    const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    setCurrentPlayer(nextPlayer);
    setMessage(`${nextPlayer === 'player1' ? 'Player 1' : (gameMode === 'pvc' ? 'Computer' : 'Player 2')}'s turn.`);
  }, [currentPlayer, gameMode]);

  const handleSelectHandTile = (tile: Domino) => {
    if (gameState !== 'playing') return;
    const activePlayer = currentPlayer === 'player1' ? player1Hand : player2Hand;
    if(!activePlayer.some(t => t.id === tile.id)) return;

    // Disallow computer tile selection from UI
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
        // New tile's RIGHT value must match board's LEFT value (`startValue`)
        if (selectedHandTile.solution === startValue) { 
            // To put solution on the right, tile must be [displayAnswer | problem], so flipped = true
            newTile.flipped = true; match = true; 
        } else if (selectedHandTile.displayAnswer === startValue) { 
            // To put displayAnswer on the right, tile must be [problem | displayAnswer], so flipped = false
            newTile.flipped = false; match = true; 
        }
    } else { // 'end'
        // New tile's LEFT value must match board's RIGHT value (`endValue`)
        if (selectedHandTile.solution === endValue) { 
            // To put solution on the left, tile must be [problem | displayAnswer], so flipped = false
            newTile.flipped = false; match = true; 
        } else if (selectedHandTile.displayAnswer === endValue) { 
            // To put displayAnswer on the left, tile must be [displayAnswer | problem], so flipped = true
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
        setMessage(`Congratulations, ${currentPlayer === 'player1' ? 'Player 1' : (gameMode === 'pvc' ? 'Computer' : 'Player 2')} wins!`);
      } else {
        switchTurn();
      }
    } else {
      setError("That's not a match. Try again!");
      setTimeout(() => setError(null), 2000);
      setSelectedHandTile(null);
    }
  }, [selectedHandTile, boardTiles, player1Hand, player2Hand, currentPlayer, switchTurn, gameMode, boardEnds]);

  const handleDrawTile = () => {
    if(heap.length === 0) {
      setMessage("Heap is empty!");
      return;
    }
    const tileToDraw = heap[0];
    const newHeap = heap.slice(1);
    if(currentPlayer === 'player1') {
      setPlayer1Hand([...player1Hand, tileToDraw]);
    } else {
      setPlayer2Hand([...player2Hand, tileToDraw]);
    }
    setHeap(newHeap);
    setMessage(`${currentPlayer === 'player1' ? 'Player 1' : (gameMode === 'pvc' ? 'Computer' : 'Player 2')} drew a tile.`);
  };

  const handlePassTurn = () => {
    setConsecutivePasses(p => p + 1);
    switchTurn();
  };
  
  // Computer AI Logic
  const handleComputerTurn = useCallback(async () => {
    setMessage("Computer is thinking...");
    
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

    while (!move && currentHeap.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const tileToDraw = currentHeap.shift()!;
        currentHand.push(tileToDraw);
        setPlayer2Hand([...currentHand]);
        setHeap([...currentHeap]);
        setMessage("Computer draws a tile...");
        move = findMove(currentHand); 
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    if (move) {
        setMessage("Computer plays a tile!");
        setSelectedHandTile(move.tile);
        setTimeout(() => handlePlaceTile(move!.end), 100);
    } else {
        setMessage("Computer has no moves and must pass.");
        handlePassTurn();
    }
  }, [player2Hand, heap, boardEnds, handlePlaceTile, handlePassTurn]);

  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === 'player2' && gameMode === 'pvc') {
        const timer = setTimeout(handleComputerTurn, 2000);
        return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, gameMode, handleComputerTurn]);

  useEffect(() => {
      if (consecutivePasses >= 2) {
          setGameState('gameOver');
          if (player1Hand.length < player2Hand.length) setWinner('player1');
          else if (player2Hand.length < player1Hand.length) setWinner('player2');
          else setWinner(null); // Draw
          setMessage("Game is blocked! No more moves can be made.");
      }
  }, [consecutivePasses, player1Hand.length, player2Hand.length]);

  const currentPlayerHand = currentPlayer === 'player1' ? player1Hand : player2Hand;
  const canCurrentPlayerPlay = useMemo(() => canPlayMove(currentPlayerHand, boardEnds), [currentPlayerHand, boardEnds]);
  
  const isPlayerTurn = (gameMode === 'pvp' && (currentPlayer === 'player1' || currentPlayer === 'player2')) || (gameMode === 'pvc' && currentPlayer === 'player1');


  // Main Render
  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4 selection:bg-[#feeba0] selection:text-black">
      <header className="w-full max-w-7xl text-center my-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#f76201]">Math Dominoes</h1>
      </header>

      <main className="w-full max-w-7xl flex-grow flex flex-col items-center gap-4">
        {/* Fix: Show GameSetup during both 'setup' and 'loading' states to provide consistent UI context and fix TypeScript error. */}
        {(gameState === 'setup' || gameState === 'loading') && <GameSetup onStartGame={handleNewGame} isLoading={gameState === 'loading'} />}
        
        {gameState === 'loading' && <div className="text-center p-4 bg-black/30 rounded-lg font-semibold">{message}</div>}

        {error && <div className="w-full text-center p-3 bg-red-500/80 rounded-lg font-semibold animate-pulse">{error}</div>}
        
        {gameState === 'gameOver' && (
            <div className="text-center p-8 bg-black/30 rounded-2xl shadow-2xl flex flex-col gap-4 items-center">
                <h2 className="text-3xl font-bold text-[#feeba0]">Game Over!</h2>
                <p className="text-xl">{message}</p>
                <button onClick={() => setGameState('setup')} className="mt-4 px-6 py-3 bg-[#f76201] text-white font-bold rounded-lg shadow-md hover:bg-[#f76201]/80 transition-colors">Play Again</button>
            </div>
        )}

        {(gameState === 'playing' || gameState === 'gameOver') && (
          <>
            {/* Opponent's Hand */}
            <PlayerHandDisplay 
              hand={player2Hand} 
              title={gameMode === 'pvc' ? "Computer's Hand" : "Player 2's Hand"} 
              isCurrentPlayer={currentPlayer === 'player2'}
              isComputer={gameMode === 'pvc'}
              onTileClick={handleSelectHandTile}
              selectedTileId={selectedHandTile?.id ?? null}
            />

            {/* Game Board */}
            <div className="bg-black/30 p-4 rounded-xl shadow-2xl w-full min-h-[250px] flex flex-col justify-center">
              <div className="flex items-center gap-2 overflow-x-auto p-4 justify-start">
                {selectedHandTile && isPlayerTurn && <button onClick={() => handlePlaceTile('start')} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#f76201]/50 rounded-lg border-2 border-dashed border-[#f76201] text-3xl font-bold hover:bg-[#f76201]/70 transition-colors">+</button>}
                {boardTiles.map((tile) => <DominoTile key={tile.id} domino={tile} isOnBoard />)}
                {selectedHandTile && isPlayerTurn && <button onClick={() => handlePlaceTile('end')} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#f76201]/50 rounded-lg border-2 border-dashed border-[#f76201] text-3xl font-bold hover:bg-[#f76201]/70 transition-colors">+</button>}
              </div>
            </div>

            {/* Controls and Status */}
             <div className="w-full p-3 bg-black/20 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="font-semibold text-[#f76201]">Heap: <span className="text-white font-bold">{heap.length}</span> tiles left</div>
                <div className="font-bold text-lg text-[#feeba0] text-center">{message}</div>
                <div className="flex gap-2">
                  {isPlayerTurn ? (
                    <>
                      <button onClick={handleDrawTile} disabled={canCurrentPlayerPlay || heap.length === 0} className="px-5 py-2 bg-[#f76201] rounded-lg font-semibold hover:bg-[#f76201]/80 disabled:bg-gray-600 disabled:cursor-not-allowed">Draw Tile</button>
                      <button onClick={handlePassTurn} disabled={!isPlayerTurn || (canCurrentPlayerPlay && currentPlayerHand.length > 0) || heap.length > 0} className="px-5 py-2 bg-[#feeba0] text-black rounded-lg font-semibold hover:bg-[#feeba0]/80 disabled:bg-gray-600 disabled:cursor-not-allowed">Pass Turn</button>
                    </>
                  ) : <div className="w-48 text-right h-[40px]"></div> }
                </div>
            </div>

            {/* Player's Hand */}
            <PlayerHandDisplay 
              hand={player1Hand} 
              title="Player 1's Hand" 
              isCurrentPlayer={currentPlayer === 'player1'}
              isComputer={false}
              onTileClick={handleSelectHandTile}
              selectedTileId={selectedHandTile?.id ?? null}
            />
          </>
        )}
      </main>
      <footer className="text-center text-[#f76201]/70 py-4 mt-auto">
        <p>Powered by React, Tailwind CSS, and Gemini</p>
      </footer>
    </div>
  );
}