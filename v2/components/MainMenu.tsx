import React, { useState, useEffect } from 'react';
import { CornerBox } from './CornerBox';
import { KingLogo } from './Icons';

interface MainMenuProps {
  onPlayLocal: () => void;
  onPlayP2P: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onPlayLocal, onPlayP2P }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Use a timeout to ensure the transition happens on mount
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center absolute inset-0 z-10">
      <CornerBox 
        className={`w-full max-w-md transition-all duration-500 ease-out 
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`
        }
      >
        <div className="text-center p-8 border-2 border-cyan-400 cyan-glow bg-gray-900/90">
          <KingLogo className="w-24 h-24 mx-auto mb-4 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 1))' }} />
          <h1 className="text-6xl text-glow-cyan tracking-widest mb-8">DEBUFF CHESS</h1>
          <div className="flex flex-col gap-4">
            <button onClick={onPlayLocal} className="text-3xl border-2 border-cyan-400 px-6 py-3 hover:bg-cyan-400/20 transition-colors cyan-glow">
              PLAY LOCALLY
            </button>
            <button onClick={onPlayP2P} className="text-3xl border-2 border-fuchsia-400 px-6 py-3 hover:bg-fuchsia-400/20 transition-colors magenta-glow">
              PLAY ONLINE (P2P)
            </button>
          </div>
        </div>
      </CornerBox>
    </div>
  );
};
