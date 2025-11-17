import React from 'react';

interface GameHeaderProps {
    onNewGame: () => void;
    onDisconnect: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onNewGame, onDisconnect }) => {
    return (
        <header className="flex-shrink-0 flex justify-between items-center p-4 panel">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-[var(--light-text)]">Debuff Chess</h1>
            <div className="flex gap-4">
                <button onClick={onNewGame} className="btn text-sm text-[var(--light-text)] hover:text-[var(--dark-bg)]">New Game</button>
                <button onClick={onDisconnect} className="btn text-sm text-[var(--light-text)] hover:text-[var(--dark-bg)]">Disconnect</button>
            </div>
        </header>
    );
};

export default GameHeader;