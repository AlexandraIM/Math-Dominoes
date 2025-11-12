import React from 'react';
import { Domino } from '../types';
import DominoTile from './DominoTile';

const GameBoard: React.FC<{
    tiles: Domino[];
    showStartButton: boolean;
    showEndButton: boolean;
    onPlaceStart: () => void;
    onPlaceEnd: () => void;
}> = ({ tiles, showStartButton, showEndButton, onPlaceStart, onPlaceEnd }) => {

    return (
        <div className="bg-black/30 p-4 rounded-xl shadow-2xl w-full min-h-[250px] flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 p-4">
                {showStartButton && <button onClick={onPlaceStart} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#f76201]/50 rounded-lg border-2 border-dashed border-[#f76201] text-3xl font-bold hover:bg-[#f76201]/70 transition-colors">+</button>}
                {tiles.map((tile) => <DominoTile key={tile.id} domino={tile} isOnBoard />)}
                {showEndButton && <button onClick={onPlaceEnd} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#f76201]/50 rounded-lg border-2 border-dashed border-[#f76201] text-3xl font-bold hover:bg-[#f76201]/70 transition-colors">+</button>}
            </div>
        </div>
    );
};

export default GameBoard;