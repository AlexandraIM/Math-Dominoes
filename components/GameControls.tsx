
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const GameControls: React.FC<{
    heapCount: number;
    message: string;
    isPlayerTurn: boolean;
    canPlayerPlay: boolean;
    drawCountThisTurn: number;
    onShowRules: () => void;
    onDrawTile: () => void;
    onPassTurn: () => void;
}> = ({
    heapCount,
    message,
    isPlayerTurn,
    canPlayerPlay,
    drawCountThisTurn,
    onShowRules,
    onDrawTile,
    onPassTurn,
}) => {
    const { t } = useLanguage();

    return (
        <div className="w-full p-3 bg-black/20 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="font-semibold text-[#f76201]">{t('heapLabel')} <span className="text-white font-bold">{heapCount}</span> {t('tilesLeft')}</div>
                <button onClick={onShowRules} className="px-5 py-2 bg-[#f76201]/50 text-white rounded-lg font-semibold hover:bg-[#f76201]/80">{t('rulesButton')}</button>
            </div>
            <div className="font-bold text-lg text-[#feeba0] text-center">{message}</div>
            <div className="flex gap-2">
                {isPlayerTurn ? (
                    <>
                        <button onClick={onDrawTile} disabled={canPlayerPlay || heapCount === 0 || drawCountThisTurn >= 3} className="px-5 py-2 bg-[#f76201] rounded-lg font-semibold hover:bg-[#f76201]/80 disabled:bg-gray-600 disabled:cursor-not-allowed">{t('drawTileButton')} ({3 - drawCountThisTurn})</button>
                        <button onClick={onPassTurn} disabled={!isPlayerTurn || canPlayerPlay || (heapCount > 0 && drawCountThisTurn < 3)} className="px-5 py-2 bg-[#feeba0] text-black rounded-lg font-semibold hover:bg-[#feeba0]/80 disabled:bg-gray-600 disabled:cursor-not-allowed">{t('passTurnButton')}</button>
                    </>
                ) : <div className="w-48 text-right h-[40px]"></div>}
            </div>
        </div>
    );
};

export default GameControls;
