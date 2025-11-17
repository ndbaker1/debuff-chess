
import React from 'react';
import type { Debuff, Move, PlayerColor } from '../types';
import { CornerBox } from './CornerBox';

interface DebuffPanelProps {
  activeDebuff: Debuff | null;
  isDebuffOnMe: boolean;
  previewedMove?: Move | null;
  debuffs: Debuff[];
  turn: PlayerColor;
}

export const DebuffPanel: React.FC<DebuffPanelProps> = ({ activeDebuff, isDebuffOnMe, previewedMove, debuffs, turn }) => {
  if (previewedMove) {
    const movingPlayer = previewedMove.piece.color;
    const debuffForMove = debuffs.find(d => d.id === previewedMove.activeDebuff);

    return (
      <CornerBox className="w-full">
        <div className="bg-gray-800/50 border-2 border-yellow-400 p-4 w-full text-white font-pixel text-2xl yellow-glow">
          <h2 className="text-3xl text-white mb-4 break-words">HISTORY PREVIEW</h2>
          <div className="p-2 bg-gray-900/50">
            <p className="text-yellow-300 text-xl">ACTIVE DEBUFF FOR {movingPlayer === 'w' ? 'WHITE' : 'BLACK'}:</p>
            {debuffForMove && debuffForMove.id !== 'NONE' ? (
              <div className="flex items-center mt-1">
                <debuffForMove.icon className="w-8 h-8 mr-4 text-yellow-400" />
                <div>
                  <p className="text-2xl">{debuffForMove.name}</p>
                  <p className="text-lg text-gray-400">{debuffForMove.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">None</p>
            )}
          </div>
        </div>
      </CornerBox>
    );
  }
  
  const debuffedPlayerName = turn === 'w' ? 'WHITE' : 'BLACK';
  const title = `DEBUFF ON ${debuffedPlayerName}`;
  
  const borderColor = isDebuffOnMe ? "border-red-500" : "border-cyan-400";
  const glowClass = isDebuffOnMe ? "red-glow" : "cyan-glow";
  const titleColor = isDebuffOnMe ? "text-red-400" : "text-cyan-300";
  const iconColor = isDebuffOnMe ? "text-red-500" : "text-cyan-400";
  
  return (
    <CornerBox className="w-full">
      <div className={`bg-gray-800/50 border-2 p-4 w-full text-white font-pixel text-2xl ${borderColor} ${glowClass}`}>
        <h2 className="text-3xl text-white mb-4 break-words">DEBUFF STATUS</h2>
        <div className="p-2 bg-gray-900/50">
          <p className={`${titleColor} text-xl`}>{activeDebuff ? title : "ACTIVE DEBUFF:"}</p>
          {activeDebuff ? (
            <div className="flex items-center mt-1">
              <activeDebuff.icon className={`w-8 h-8 mr-4 ${iconColor}`} />
              <div>
                <p className="text-2xl">{activeDebuff.name}</p>
                <p className="text-lg text-gray-400">{activeDebuff.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mt-1">None</p>
          )}
        </div>
      </div>
    </CornerBox>
  );
};