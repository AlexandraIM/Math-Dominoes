
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const GameControls: React.FC<{
    heapCount: number;
    message: string;
    isPlayerTurn: boolean;
    drawCountThisTurn: number;
    onShowRules: () => void;
    onToggleHints: () => void;
    onDrawTile: () => void;
    onPassTurn: () => void;
}> = ({
    heapCount,
    message,
    isPlayerTurn,
    drawCountThisTurn,
    onShowRules,
    onToggleHints,
    onDrawTile,
    onPassTurn,
}) => {
    const { t } = useLanguage();

    return (
        <div className="w-full p-3 bg-[#fff1e6]/60 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="font-semibold text-[#52796f]">{t('heapLabel')} <span className="text-[#2f3e46] font-bold">{heapCount}</span> {t('tilesLeft')}</div>
                <button onClick={onShowRules} className="px-5 py-2 bg-[#83c5be]/50 text-[#2f3e46] rounded-lg font-semibold hover:bg-[#83c5be]/80">{t('rulesButton')}</button>
                <button onClick={onToggleHints} className="px-5 py-2 bg-[#83c5be]/50 text-[#2f3e46] rounded-lg font-semibold hover:bg-[#83c5be]/80">{t('toggleHintsButton')}</button>
            </div>
            <div className="font-bold text-lg text-[#52796f] text-center">{message}</div>
            <div className="flex gap-2">
                {isPlayerTurn ? (
                    <>
                        <button onClick={onDrawTile} disabled={heapCount === 0 || drawCountThisTurn >= 3} className="px-5 py-2 bg-[#83c5be] text-white rounded-lg font-semibold hover:bg-[#83c5be]/80 disabled:bg-gray-400 disabled:cursor-not-allowed">{t('drawTileButton')} ({3 - drawCountThisTurn})</button>
                        <button onClick={onPassTurn} className="px-5 py-2 bg-[#fff1e6] text-[#2f3e46] rounded-lg font-semibold hover:bg-[#fff1e6]/80 disabled:bg-gray-400 disabled:cursor-not-allowed">{t('passTurnButton')}</button>
                    </>
                ) : <div className="w-48 text-right h-[40px]"></div>}
            </div>
        </div>
    );
};

export default GameControls;