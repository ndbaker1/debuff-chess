import React from 'react';

interface MainMenuProps {
    onPlayLocal: () => void;
    onPlayP2P: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlayLocal, onPlayP2P }) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center p-4 text-center" style={{ animation: 'fadeIn 1s ease-out' }}>
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[var(--cyan)] rounded-full" style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)',
                    animation: 'glitch 1s linear infinite'
                }}></div>
                <div className="absolute inset-0 border-2 border-[var(--magenta)] rounded-full" style={{
                    clipPath: 'polygon(0% 10%, 10% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    animation: 'glitch-top 1.2s linear infinite'
                }}></div>

                <svg viewBox="0 0 24 24" className="w-32 h-32" style={{ filter: 'drop-shadow(0 0 10px var(--cyan))' }}>
                    <path fill="var(--light-text)" d="M12 1.5L9 5.5h6L12 1.5zM2 7.5h20v2H2zM4 11.5h16v10H4v-10zM7 23.5h10v-2H7v2zM11 13.5h2v6h-2v-6zM8 13.5h2v6H8v-6zM14 13.5h2v6h-2v-6z"/>
                </svg>
            </div>

            <h1 className="relative text-5xl md:text-6xl font-bold uppercase tracking-widest mb-12">
                <span className="absolute inset-0 text-[var(--cyan)]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)', animation: 'glitch-top 1.5s linear infinite' }}>Debuff Chess</span>
                Debuff Chess
                <span className="absolute inset-0 text-[var(--magenta)]" style={{ clipPath: 'polygon(0 61%, 100% 41%, 100% 100%, 0 100%)', animation: 'glitch-bottom 1.3s linear infinite' }}>Debuff Chess</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onPlayLocal} className="btn">Play Locally</button>
                <button onClick={onPlayP2P} className="btn">Play Online (P2P)</button>
            </div>
        </div>
    );
};

export default MainMenu;
