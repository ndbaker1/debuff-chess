
import React, { useState, useMemo } from 'react';
import { type Chess, type Square, type Piece } from 'chess.js';
import PieceComponent from './icons/Piece';
import { type Debuff, type PlayerColor, type Move } from '../types';

interface ChessboardProps {
  game: Chess;
  onMove: (move: Move) => void;
  playerColor: PlayerColor;
  isMyTurn: boolean;
  activeDebuff: Debuff | null;
}

const Chessboard: React.FC<ChessboardProps> = ({ game, onMove, playerColor, isMyTurn, activeDebuff }) => {
  const [fromSquare, setFromSquare] = useState<Square | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);

  const board = useMemo(() => {
    const b = game.board();
    return playerColor === 'w' ? b : b.slice().reverse().map(row => row.slice().reverse());
  }, [game, playerColor]);

  const getSquareFromCoords = (rowIndex: number, colIndex: number): Square => {
    if (playerColor === 'w') {
      return `${'abcdefgh'[colIndex]}${8 - rowIndex}` as Square;
    }
    return `${'hgfedcba'[colIndex]}${rowIndex + 1}` as Square;
  };

  const handleMouseEnter = (square: Square) => {
    if (!isMyTurn) return;
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setHoveredSquare(square);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSquare(null);
  };

  const handleSquareClick = (square: Square) => {
    if (!isMyTurn) return;
    setHoveredSquare(null); // Clear hover on click

    if (fromSquare) {
      if (fromSquare === square) {
        setFromSquare(null);
        return;
      }
      
      const pieceOnTarget = game.get(square);
      if (pieceOnTarget && pieceOnTarget.color === game.turn()) {
        setFromSquare(square);
        return;
      }
      
      const piece = game.get(fromSquare);
      const isPromotion = piece?.type === 'p' && (square[1] === '8' || square[1] === '1');
      
      const move: Move = { from: fromSquare, to: square };
      if (isPromotion) {
        move.promotion = 'q';
      }

      if (activeDebuff && !activeDebuff.validate(move, game)) {
         console.log(`Move blocked by debuff: ${activeDebuff.name}`);
         setFromSquare(null);
         return;
      }
      
      const possibleMoves = game.moves({ square: fromSquare, verbose: true });
      const isValidMove = possibleMoves.some(m => m.to === square);

      if (isValidMove) {
        onMove(move);
      }
      
      setFromSquare(null);

    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setFromSquare(square);
      }
    }
  };
  
  const squareForMoves = fromSquare ?? hoveredSquare;

  const movesToShow = useMemo(() => {
    if (!squareForMoves) return new Map<Square, 'move' | 'capture'>();
    
    const piece = game.get(squareForMoves);
    if (!piece || piece.color !== game.turn()) {
        return new Map<Square, 'move' | 'capture'>();
    }
    
    const moves = new Map<Square, 'move' | 'capture'>();
    
    game.moves({ square: squareForMoves, verbose: true })
        .filter(move => !activeDebuff || activeDebuff.validate(move, game))
        .forEach(move => {
            const isCapture = !!game.get(move.to) || move.flags.includes('e');
            moves.set(move.to, isCapture ? 'capture' : 'move');
        });
        
    return moves;
  }, [squareForMoves, game, activeDebuff]);


  return (
    <div 
      className="aspect-square w-full mx-auto grid grid-cols-8 border"
      style={{ 
          borderColor: 'var(--cyan)',
          boxShadow: '0 0 15px var(--cyan), inset 0 0 10px -5px var(--cyan)' 
      }}
    >
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((piece, colIndex) => {
            const square = getSquareFromCoords(rowIndex, colIndex);
            
            const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
            const rank = parseInt(square.charAt(1), 10) - 1;
            const isLight = (file + rank) % 2 !== 0;

            const isSelected = square === fromSquare;
            const moveType = movesToShow.get(square);
            const isHovered = square === hoveredSquare && !fromSquare;


            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onMouseEnter={() => handleMouseEnter(square)}
                onMouseLeave={handleMouseLeave}
                className={`relative aspect-square w-full h-full ${isMyTurn ? 'cursor-pointer' : ''} transition-colors duration-200`}
                style={{
                    backgroundColor: isLight ? 'rgba(41, 213, 228, 0.08)' : 'rgba(0, 0, 0, 0.1)',
                    borderRight: colIndex < 7 ? '1px solid var(--cyan)' : 'none',
                    borderBottom: rowIndex < 7 ? '1px solid var(--cyan)' : 'none',
                }}
              >
                {piece && <div className="p-1"><PieceComponent piece={piece} /></div>}
                 {isSelected && <div className="absolute inset-0 bg-[rgba(96,215,233,0.2)]" style={{boxShadow: 'inset 0 0 10px 2px var(--cyan)'}} />}
                 {isHovered && <div className="absolute inset-0 bg-[rgba(255,255,255,0.1)]" />}
                 {moveType === 'move' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4V20M4 12H20" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 3px var(--cyan))'}}/>
                        </svg>
                    </div>
                 )}
                 {moveType === 'capture' && (
                    <div className="absolute inset-0 flex items-center justify-center p-1 pointer-events-none">
                       <div className="w-[80%] h-[80%] border-2 border-[var(--cyan)] rounded-full" style={{boxShadow: '0 0 8px var(--cyan)'}}/>
                    </div>
                 )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Chessboard;