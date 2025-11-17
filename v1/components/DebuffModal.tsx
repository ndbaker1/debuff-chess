import React from 'react';
import { type Debuff } from '../types';

interface DebuffModalProps {
  debuffs: Debuff[];
  onSelectDebuff: (debuff: Debuff) => void;
}

const DebuffModal: React.FC<DebuffModalProps> = ({ debuffs, onSelectDebuff }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="panel w-full max-w-md p-6" style={{animation: 'fadeIn 0.3s ease-out forwards'}}>
        <h2 className="text-2xl font-bold mb-4 text-center glow-text text-[var(--cyan)] uppercase">Choose a Debuff</h2>
        <p className="text-slate-400 mb-6 text-center">This restriction will apply to your opponent's next move.</p>
        <div className="space-y-3">
          {debuffs.map(debuff => (
            <button
              key={debuff.id}
              onClick={() => onSelectDebuff(debuff)}
              className="w-full text-left p-4 bg-black/30 hover:bg-[var(--cyan)] hover:text-[var(--dark-bg)] transition-all duration-200 border border-[var(--cyan)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex-shrink-0 text-[var(--cyan)]">
                    <debuff.icon />
                </div>
                <div>
                  <h3 className="font-semibold text-lg uppercase">{debuff.name}</h3>
                  <p className="text-sm text-slate-300 normal-case tracking-normal">{debuff.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebuffModal;