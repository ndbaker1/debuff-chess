

import React from 'react';
import type { Debuff, PlayerColor, DebuffId } from '../types';
import { CornerBox } from './CornerBox';

interface DebuffSelectionModalProps {
  debuffs: Debuff[];
  onSelectDebuff: (debuffId: DebuffId) => void;
  opponentColor: PlayerColor;
}

export const DebuffSelectionModal: React.FC<DebuffSelectionModalProps> = ({ debuffs, onSelectDebuff, opponentColor }) => {
    const opponentName = opponentColor === 'w' ? 'WHITE' : 'BLACK';

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <CornerBox className="w-full max-w-lg">
                <div className="relative text-center p-8 border-4 border-fuchsia-400 magenta-glow bg-gray-900 w-full">
                    <h2 className="text-4xl text-white text-glow-magenta mb-6">INFLICT DEBUFF ON {opponentName}</h2>
                    <div className="space-y-4">
                        {debuffs.map((debuff) => (
                            <button
                                key={debuff.id}
                                onClick={() => onSelectDebuff(debuff.id)}
                                className="w-full flex items-center p-4 bg-gray-900/50 border-2 border-fuchsia-500/50 transition-all duration-200 hover:bg-fuchsia-500/30 hover:border-fuchsia-400"
                            >
                                <debuff.icon className="w-10 h-10 mr-4 text-fuchsia-400" />
                                <div className="text-left">
                                    <p className="text-3xl">{debuff.name}</p>
                                    <p className="text-xl text-gray-400">{debuff.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </CornerBox>
        </div>
    );
};