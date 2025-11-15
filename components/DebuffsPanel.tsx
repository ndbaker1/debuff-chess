import React from 'react';
import { Debuff, PlayerColor } from '../types';

interface DebuffsPanelProps {
    activeDebuff: Debuff | null;
    outgoingDebuff: Debuff | null;
    isMyTurn: boolean;
    isLocalGame: boolean;
    turn: PlayerColor;
    isWaitingForDebuff: boolean;
}

const DebuffsPanel: React.FC<DebuffsPanelProps> = ({ activeDebuff, outgoingDebuff, isMyTurn, isLocalGame, turn, isWaitingForDebuff }) => {
    
    let title: string;
    let color: string;
    let debuffToShow: Debuff | null;
    let emptyMessage: string;

    if (isLocalGame) {
        title = `Debuff for ${turn === 'w' ? 'White' : 'Black'}`;
        color = 'var(--cyan)';
        debuffToShow = activeDebuff;
        emptyMessage = 'No debuff is currently active.';
    } else if (isMyTurn) {
        title = 'Debuff on You';
        color = 'var(--magenta)';
        debuffToShow = activeDebuff;
        emptyMessage = 'No debuff is active on you.';
    } else { // Opponent's turn or waiting period
        if (outgoingDebuff) {
            title = 'Debuff on Opponent';
            color = 'var(--cyan)';
            debuffToShow = outgoingDebuff;
            emptyMessage = ''; // Not used when debuff is shown
        } else {
            title = 'Active Debuff';
            color = 'var(--light-text)';
            debuffToShow = null;
            emptyMessage = isWaitingForDebuff 
                ? 'Opponent is choosing a debuff...' 
                : 'Awaiting your move...';
        }
    }

    return (
        <div className="w-full p-4 panel flex flex-col">
             <h2 className="panel-title flex-shrink-0" style={{color: color, borderBottomColor: `${color}40`}}>
                {title}
             </h2>
             <div className="flex-grow flex items-center justify-center">
                 {debuffToShow ? (
                    <div className="text-center w-full bg-black/30 p-4">
                        <div className="w-16 h-16 mx-auto mb-4" style={{color: color}}>
                            <debuffToShow.icon />
                        </div>
                        <h3 
                            className="text-xl font-bold uppercase" 
                            style={{ color: color, textShadow: `0 0 4px ${color}` }}
                        >
                            {debuffToShow.name}
                        </h3>
                        <p className="text-slate-300">{debuffToShow.description}</p>
                    </div>
                 ) : (
                    <p className="text-slate-400 italic">
                        {emptyMessage}
                    </p>
                 )}
             </div>
        </div>
    );
};

export default DebuffsPanel;
