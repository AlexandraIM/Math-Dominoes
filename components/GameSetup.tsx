
import React, { useState } from 'react';
import { Difficulty, GameMode, AIDifficulty } from '../types';
import { useLanguage } from '../context/LanguageContext';

const GameSetup: React.FC<{
  onStartGame: (difficulty: Difficulty, mode: GameMode, aiDifficulty: AIDifficulty) => void,
  isLoading: boolean,
  onShowRules: () => void,
}> = ({ onStartGame, isLoading, onShowRules }) => {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('pvc');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('hard');
  const [difficultyMode, setDifficultyMode] = useState<'standard' | 'grade'>('standard');

  const handleDifficultyModeChange = (newMode: 'standard' | 'grade') => {
    setDifficultyMode(newMode);
    if (newMode === 'standard') {
      setDifficulty('easy');
    } else {
      setDifficulty('grade1');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-[#fff1e6]/70 rounded-2xl shadow-xl flex flex-col gap-6 text-center">
      <h2 className="text-3xl font-bold text-[#52796f]">{t('gameSetupTitle')}</h2>
      <div className="space-y-4">

        <div>
          <label className="block font-semibold text-[#52796f] mb-2">{t('difficultyTypeLabel')}</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => handleDifficultyModeChange('standard')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${difficultyMode === 'standard' ? 'bg-[#83c5be] text-white' : 'bg-[#f5e6d3]/60 hover:bg-[#f5e6d3]'}`}>{t('standardButton')}</button>
            <button onClick={() => handleDifficultyModeChange('grade')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${difficultyMode === 'grade' ? 'bg-[#83c5be] text-white' : 'bg-[#f5e6d3]/60 hover:bg-[#f5e6d3]'}`}>{t('schoolGradeButton')}</button>
          </div>
        </div>

        {difficultyMode === 'standard' ? (
          <div>
            <label htmlFor="difficulty" className="block font-semibold text-[#52796f] mb-2">{t('difficultyLabel')}</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full bg-[#f5e6d3]/80 text-[#2f3e46] rounded-md p-3 border-2 border-[#83c5be]/50 focus:ring-2 focus:ring-[#83c5be] focus:outline-none">
              <option value="easy">{t('easy')}</option>
              <option value="easy+">{t('easyPlus')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="hard">{t('hard')}</option>
            </select>
          </div>
        ) : (
           <div>
            <label htmlFor="difficulty" className="block font-semibold text-[#52796f] mb-2">{t('schoolGradeLabel')}</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full bg-[#f5e6d3]/80 text-[#2f3e46] rounded-md p-3 border-2 border-[#83c5be]/50 focus:ring-2 focus:ring-[#83c5be] focus:outline-none">
              <option value="grade1">{t('grade1')}</option>
              <option value="grade2">{t('grade2')}</option>
              <option value="grade3">{t('grade3')}</option>
              <option value="grade4">{t('grade4')}</option>
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold text-[#52796f] mb-2">{t('gameModeLabel')}</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => setMode('pvc')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvc' ? 'bg-[#83c5be] text-white' : 'bg-[#f5e6d3]/60 hover:bg-[#f5e6d3]'}`}>{t('vsComputer')}</button>
            <button onClick={() => setMode('pvp')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvp' ? 'bg-[#83c5be] text-white' : 'bg-[#f5e6d3]/60 hover:bg-[#f5e6d3]'}`}>{t('vsPlayer')}</button>
          </div>
        </div>
        {mode === 'pvc' && (
          <div>
            <label htmlFor="ai-difficulty" className="block font-semibold text-[#52796f] mb-2">{t('aiDifficultyLabel')}</label>
            <select
              id="ai-difficulty"
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value as AIDifficulty)}
              className="w-full bg-[#f5e6d3]/80 text-[#2f3e46] rounded-md p-3 border-2 border-[#83c5be]/50 focus:ring-2 focus:ring-[#83c5be] focus:outline-none"
            >
              <option value="easy">{t('aiEasy')}</option>
              <option value="normal">{t('aiNormal')}</option>
              <option value="hard">{t('aiHard')}</option>
            </select>
          </div>
        )}
      </div>
      <button onClick={() => onStartGame(difficulty, mode, aiDifficulty)} disabled={isLoading} className="w-full px-6 py-4 bg-[#83c5be] text-white font-bold rounded-lg shadow-md hover:bg-[#83c5be]/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg">
        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : t('startGame')}
      </button>
      <button onClick={onShowRules} className="w-full px-6 py-3 bg-[#f5e6d3]/60 text-[#52796f] font-bold rounded-lg shadow-md hover:bg-[#f5e6d3] transition-colors">
        {t('viewRules')}
      </button>
    </div>
  );
};

export default GameSetup;