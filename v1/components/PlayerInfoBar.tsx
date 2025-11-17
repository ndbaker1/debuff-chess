import React from 'react';
import { PlayerColor } from '../types';

interface PlayerInfoBarProps {
    player1Name: string;
    player2Name: string;
    gameStatus: string;
    turn: PlayerColor;
}

const PlayerInfoBar: React.FC<PlayerInfoBarProps> = ({ player1Name, player2Name, gameStatus, turn }) => {
    const isPlayer1Turn = turn === 'w';

    return (
        <div className="flex-shrink-0 flex items-center justify-between p-4 panel">
            <div className={`text-xl font-bold uppercase transition-all duration-300 ${isPlayer1Turn ? 'text-[var(--cyan)] glow-text' : 'text-gray-500'}`}>
                {player1Name}
            </div>
            <div className="relative text-center text-lg font-semibold px-6 mx-4 flex-grow">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-0.5 bg-[var(--cyan)]" style={{boxShadow: '0 0 4px var(--cyan)'}} />
                {gameStatus}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3/4 w-0.5 bg-[var(--magenta)]" style={{boxShadow: '0 0 4px var(--magenta)'}} />
            </div>
            <div 
                className={`text-xl font-bold uppercase transition-all duration-300 ${!isPlayer1Turn ? 'text-[var(--magenta)]' : 'text-gray-500'}`}
                style={!isPlayer1Turn ? { textShadow: '0 0 4px var(--magenta)'} : {}}
            >
                {player2Name}
            </div>
        </div>
    );
}

export default PlayerInfoBar;