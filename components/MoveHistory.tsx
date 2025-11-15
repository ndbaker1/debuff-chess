import React, { useState, useRef, useEffect } from 'react';
import { type HistoryEntry, type Debuff } from '../types';
import MiniBoard from './MiniBoard';

interface MoveHistoryProps {
  history: HistoryEntry[];
}

interface TooltipState {
    entry: HistoryEntry;
    activeDebuff: Debuff | null;
    top: number;
    left: number;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ history }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, entry: HistoryEntry, activeDebuff: Debuff | null) => {
    const tooltipWidth = 288; // miniboard (256) + padding (32)
    const tooltipHeight = 400; // Estimated height
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const margin = 15; // Margin from cursor and viewport edges

    let top = clientY - tooltipHeight - margin;
    let left = clientX + margin;

    // Keep it within the viewport
    if (top < margin) {
      top = clientY + margin * 1.5; // Flip below if not enough space above
      if (top + tooltipHeight > innerHeight - margin) {
        top = innerHeight - tooltipHeight - margin; // Stick to bottom if still no space
      }
    }

    if (left + tooltipWidth > innerWidth - margin) {
      left = clientX - tooltipWidth - margin; // Flip to the left
    }
    
    if (left < margin) {
        left = margin;
    }
    
    setTooltip({ entry, activeDebuff, top, left });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="w-full p-4 panel flex flex-col flex-grow min-h-[250px] max-h-[50vh]">
      <h2 className="panel-title flex-shrink-0">Move History</h2>
      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 min-h-0">
        {history.length === 0 ? (
          <p className="text-slate-400 italic">No moves yet...</p>
        ) : (
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
            {history.map((entry, index) => {
              const turnNumber = Math.floor(index / 2) + 1;
              const isWhiteMove = entry.color === 'w';
              const activeDebuffForThisMove = index > 0 ? history[index - 1].debuff : null;
              const isLastMove = index === history.length - 1;

              return (
                <React.Fragment key={index}>
                  {isWhiteMove && (
                     <span className="font-bold text-right text-slate-400">{turnNumber}.</span>
                  )}
                  {!isWhiteMove && <div />}
                  <div 
                    className={`p-2 cursor-default transition-colors duration-200 relative overflow-hidden ${isLastMove ? 'bg-black/60 text-white' : (isWhiteMove ? 'bg-white/5' : 'bg-black/20')}`}
                    onMouseEnter={(e) => handleMouseEnter(e, entry, activeDebuffForThisMove)}
                    onMouseLeave={handleMouseLeave}
                  >
                     {isLastMove && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--cyan)]" />}
                    <span className="font-bold text-xl">{entry.san}</span>
                    <p className="text-xs uppercase opacity-70">
                      Debuff: {entry.debuff.name}
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
      {tooltip && (
        <div 
          className="fixed z-50 p-4 panel space-y-2 flex flex-col items-center"
          style={{ 
            top: tooltip.top, 
            left: tooltip.left, 
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
            <h3 className="font-bold text-lg text-white glow-text">{tooltip.entry.san}</h3>
            <MiniBoard fen={tooltip.entry.fenBefore} move={tooltip.entry.move} color={tooltip.entry.color} />
            <div className="p-2 bg-black/30 w-full">
                {tooltip.activeDebuff ? (
                    <>
                        <h4 className="font-semibold text-red-400 uppercase text-sm">Debuff Active: {tooltip.activeDebuff.name}</h4>
                        <p className="text-xs text-slate-300 normal-case">{tooltip.activeDebuff.description}</p>
                    </>
                ) : (
                    <p className="text-xs text-slate-400 italic">No debuff was active.</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default MoveHistory;