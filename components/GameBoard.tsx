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
        <div className="bg-[#fff1e6]/70 p-4 rounded-xl shadow-lg w-full min-h-[250px] flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 p-4">
                {showStartButton && <button onClick={onPlaceStart} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#83c5be]/50 rounded-lg border-2 border-dashed border-[#83c5be] text-3xl font-bold hover:bg-[#83c5be]/70 transition-colors text-white">+</button>}
                {tiles.map((tile) => <DominoTile key={tile.id} domino={tile} isOnBoard />)}
                {showEndButton && <button onClick={onPlaceEnd} className="h-16 w-16 md:h-20 md:w-20 shrink-0 bg-[#83c5be]/50 rounded-lg border-2 border-dashed border-[#83c5be] text-3xl font-bold hover:bg-[#83c5be]/70 transition-colors text-white">+</button>}
            </div>
        </div>
    );
};

export default GameBoard;