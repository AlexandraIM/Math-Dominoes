
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
    <div className="w-full max-w-md mx-auto p-8 bg-black/30 rounded-2xl shadow-2xl flex flex-col gap-6 text-center">
      <h2 className="text-3xl font-bold text-[#f76201]">{t('gameSetupTitle')}</h2>
      <div className="space-y-4">

        <div>
          <label className="block font-semibold text-[#f76201] mb-2">{t('difficultyTypeLabel')}</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => handleDifficultyModeChange('standard')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${difficultyMode === 'standard' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>{t('standardButton')}</button>
            <button onClick={() => handleDifficultyModeChange('grade')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${difficultyMode === 'grade' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>{t('schoolGradeButton')}</button>
          </div>
        </div>

        {difficultyMode === 'standard' ? (
          <div>
            <label htmlFor="difficulty" className="block font-semibold text-[#f76201] mb-2">{t('difficultyLabel')}</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full bg-black/30 text-white rounded-md p-3 border-2 border-[#f76201]/50 focus:ring-2 focus:ring-[#f76201] focus:outline-none">
              <option value="easy">{t('easy')}</option>
              <option value="easy+">{t('easyPlus')}</option>
              <option value="medium">{t('medium')}</option>
              <option value="hard">{t('hard')}</option>
            </select>
          </div>
        ) : (
           <div>
            <label htmlFor="difficulty" className="block font-semibold text-[#f76201] mb-2">{t('schoolGradeLabel')}</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full bg-black/30 text-white rounded-md p-3 border-2 border-[#f76201]/50 focus:ring-2 focus:ring-[#f76201] focus:outline-none">
              <option value="grade1">{t('grade1')}</option>
              <option value="grade2">{t('grade2')}</option>
              <option value="grade3">{t('grade3')}</option>
              <option value="grade4">{t('grade4')}</option>
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold text-[#f76201] mb-2">{t('gameModeLabel')}</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => setMode('pvc')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvc' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>{t('vsComputer')}</button>
            <button onClick={() => setMode('pvp')} className={`flex-1 p-3 rounded-lg font-bold transition-colors ${mode === 'pvp' ? 'bg-[#f76201] text-white' : 'bg-black/30 hover:bg-black/50'}`}>{t('vsPlayer')}</button>
          </div>
        </div>
        {mode === 'pvc' && (
          <div>
            <label htmlFor="ai-difficulty" className="block font-semibold text-[#f76201] mb-2">{t('aiDifficultyLabel')}</label>
            <select
              id="ai-difficulty"
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value as AIDifficulty)}
              className="w-full bg-black/30 text-white rounded-md p-3 border-2 border-[#f76201]/50 focus:ring-2 focus:ring-[#f76201] focus:outline-none"
            >
              <option value="easy">{t('aiEasy')}</option>
              <option value="normal">{t('aiNormal')}</option>
              <option value="hard">{t('aiHard')}</option>
            </select>
          </div>
        )}
      </div>
      <button onClick={() => onStartGame(difficulty, mode, aiDifficulty)} disabled={isLoading} className="w-full px-6 py-4 bg-[#f76201] text-white font-bold rounded-lg shadow-md hover:bg-[#f76201]/80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg">
        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : t('startGame')}
      </button>
      <button onClick={onShowRules} className="w-full px-6 py-3 bg-black/40 text-[#f76201] font-bold rounded-lg shadow-md hover:bg-black/60 transition-colors">
        {t('viewRules')}
      </button>
    </div>
  );
};

export default GameSetup;
