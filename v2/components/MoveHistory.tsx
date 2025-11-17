
import React from 'react';
import type { Move } from '../types';
import { CornerBox } from './CornerBox';

interface MoveHistoryProps {
  history: Move[];
  onHoverMove: (index: number | null) => void;
  currentMoveIndex: number;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, onHoverMove, currentMoveIndex }) => {
  return (
    <CornerBox className="w-full">
      <div className="bg-gray-800/50 border-2 border-cyan-400 p-4 w-full text-white font-pixel text-2xl cyan-glow">
        <h2 className="text-3xl text-white mb-4">MOVE HISTORY</h2>
        <div className="overflow-y-auto max-h-64 pr-2">
          <ul className="space-y-1">
            {history.length === 0 && <li className="text-gray-400">No moves yet.</li>}
            {history.map((move, index) => {
               const moveNumber = Math.floor(index / 2) + 1;
               const isWhiteMove = index % 2 === 0;
               const isActive = index === currentMoveIndex -1;
               const bgColor = isWhiteMove ? 'bg-gray-700/40' : 'bg-gray-900/60';

               return (
                <li
                  key={index}
                  className={`p-2 transition-all duration-200 cursor-default relative overflow-hidden
                      ${isActive ? 'bg-gray-700/80' : bgColor}`}
                  onMouseEnter={() => onHoverMove(index)}
                  onMouseLeave={() => onHoverMove(null)}
                >
                  <div className="flex items-baseline">
                      <span className="w-8 text-gray-400">{isWhiteMove ? `${moveNumber}.` : ''}</span>
                      <span className="text-white">{move.notation}</span>
                  </div>
                  {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-fuchsia-500"></div>}
                </li>
              )
          })}
          </ul>
        </div>
      </div>
    </CornerBox>
  );
};