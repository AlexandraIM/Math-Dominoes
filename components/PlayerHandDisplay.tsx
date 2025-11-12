import React from 'react';
import { Domino } from '../types';
import DominoTile from './DominoTile';
import { useLanguage } from '../context/LanguageContext';

const PlayerHandDisplay: React.FC<{
  hand: Domino[];
  title: string;
  isCurrentPlayer: boolean;
  isComputer: boolean;
  onTileClick: (tile: Domino) => void;
  selectedTileId: number | null;
  score: number;
  playableTileIds: Set<number>;
}> = ({ hand, title, isCurrentPlayer, isComputer, onTileClick, selectedTileId, score, playableTileIds }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-black/20 p-4 rounded-xl shadow-inner min-h-[140px] w-full">
      <h2 className="text-lg font-semibold text-[#f76201] mb-4 text-center">
        {title} <span className="text-white/80 font-normal">({t('scoreLabel')} {score})</span>
        {isCurrentPlayer && <span className="text-[#feeba0]"> {t('currentTurnIndicator')}</span>}
      </h2>
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
                isPlayable={playableTileIds.has(tile.id)}
              />
          ))}
        </div>
      ) : <p className="text-center text-[#f76201]/70">{t('noTilesLeft')}</p>}
    </div>
  );
}

export default PlayerHandDisplay;