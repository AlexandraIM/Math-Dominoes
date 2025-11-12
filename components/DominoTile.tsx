import React from 'react';
import { Domino } from '../types';

const DominoTile: React.FC<{
  domino: Domino;
  onClick?: () => void;
  isSelected?: boolean;
  isOnBoard?: boolean;
  isPlayable?: boolean;
}> = ({ domino, onClick, isSelected, isOnBoard, isPlayable }) => {
  const { problem, displayAnswer, flipped } = domino;

  // Base styles
  const containerClasses = `
    h-16 w-40 md:h-20 md:w-48 shrink-0 
    transition-all duration-200 ease-in-out 
    [perspective:1000px]
    group
  `;
  const flipperClasses = `
    relative w-full h-full 
    transition-transform duration-500 
    [transform-style:preserve-3d]
    ${isOnBoard && flipped ? '[transform:rotateY(180deg)]' : ''}
  `;
  const faceClasses = `
    absolute w-full h-full 
    flex rounded-lg shadow-lg border-2 font-bold
    [backface-visibility:hidden]
    transition-all
  `;
  const stateClasses = isOnBoard
    ? "bg-[#d41e00] border-[#f76201]/50 text-[#feeba0]"
    : "bg-[#feeba0] border-[#feeba0]/50 text-black cursor-pointer group-hover:bg-[#feeba0]/80";
  const selectedClasses = isSelected ? "ring-4 ring-[#f76201] scale-105 shadow-xl" : "";
  const playableClasses = isPlayable && !isSelected ? "ring-4 ring-green-400/80 shadow-lg" : "";

  return (
    <div className={`${containerClasses} ${!isOnBoard && isSelected ? 'scale-105' : ''}`} onClick={onClick}>
      <div className={flipperClasses}>
        {/* Front face of the domino */}
        <div className={`${faceClasses} ${stateClasses} ${!isOnBoard ? selectedClasses : ''} ${!isOnBoard ? playableClasses : ''}`}>
          <div className="w-1/2 flex items-center justify-center text-center text-xs md:text-base break-words border-r-2 border-black/30 p-1">{problem}</div>
          <div className="w-1/2 flex items-center justify-center text-center text-lg md:text-xl break-words p-1">{displayAnswer}</div>
        </div>
        {/* Back face of the domino (for flipping on board) */}
        <div className={`${faceClasses} ${stateClasses} [transform:rotateY(180deg)]`}>
          <div className="w-1/2 flex items-center justify-center text-center text-lg md:text-xl break-words border-r-2 border-black/30 p-1">{displayAnswer}</div>
          <div className="w-1/2 flex items-center justify-center text-center text-xs md:text-base break-words p-1">{problem}</div>
        </div>
      </div>
    </div>
  );
};

export default DominoTile;