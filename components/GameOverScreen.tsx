
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const GameOverScreen: React.FC<{
    message: string;
    onPlayAgain: () => void;
}> = ({ message, onPlayAgain }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center p-8 bg-[#fff1e6]/80 rounded-2xl shadow-2xl flex flex-col gap-4 items-center">
            <h2 className="text-3xl font-bold text-[#52796f]">{t('gameOverTitle')}</h2>
            <p className="text-xl">{message}</p>
            <button onClick={onPlayAgain} className="mt-4 px-6 py-3 bg-[#83c5be] text-white font-bold rounded-lg shadow-md hover:bg-[#83c5be]/80 transition-colors">{t('playAgainButton')}</button>
        </div>
    );
};

export default GameOverScreen;