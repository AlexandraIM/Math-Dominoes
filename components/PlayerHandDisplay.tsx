
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
    <div className="bg-[#fff1e6]/60 p-4 rounded-xl shadow-inner min-h-[140px] w-full">
      <h2 className="text-lg font-semibold text-[#52796f] mb-4 text-center">
        {title} <span className="text-[#2f3e46]/80 font-normal">({t('scoreLabel')} {score})</span>
        {isCurrentPlayer && <span className="text-[#83c5be] font-bold"> {t('currentTurnIndicator')}</span>}
      </h2>
      {hand.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {hand.map((tile) => (
            isComputer ?
              <div key={tile.id} className="h-16 w-40 md:h-20 md:w-48 rounded-lg bg-[#52796f] border-2 border-[#83c5be]/40 shadow-md flex items-center justify-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-1/2 h-1/2 opacity-70 text-[#fff1e6]"
                >
                  <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-2.434 2.344-4.5z" />
                  <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7 .08.703-1.725 1.722-3.656 1-1.261-.472-1.96-2.434-2.344-4.5z" />
                  <path d="M8.483 9.643c.202 2.449 1.547 5.13 4.133 5.327 2.642.202 4.11-2.942 3.921-5.388" />
                </svg>
              </div> :
              <DominoTile
                key={tile.id}
                domino={tile}
                onClick={() => onTileClick(tile)}
                isSelected={selectedTileId === tile.id}
                isPlayable={playableTileIds.has(tile.id)}
              />
          ))}
        </div>
      ) : <p className="text-center text-[#52796f]/70">{t('noTilesLeft')}</p>}
    </div>
  );
}

export default PlayerHandDisplay;
