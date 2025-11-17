
import React from 'react';
import type { Board, Piece, Move } from '../types';
import { PlayerColor } from '../types';
import {
  WhitePawn, WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing,
  BlackPawn, BlackRook, BlackKnight, BlackBishop, BlackQueen, BlackKing,
} from './Icons';
import { CornerBox } from './CornerBox';

interface ChessboardProps {
  board: Board;
  turn: PlayerColor;
  onMove: (from: [number, number], to: [number, number]) => void;
  validMoves: { to: [number, number] }[];
  onSelectPiece: (from: [number, number]) => void;
  selectedSquare: [number, number] | null;
  historyPreview?: Board | null;
  disabled: boolean;
  previewedMove?: Move | null;
}

const pieceComponents: { [key: string]: React.ComponentType } = {
  wp: WhitePawn, wr: WhiteRook, wn: WhiteKnight, wb: WhiteBishop, wq: WhiteQueen, wk: WhiteKing,
  bp: BlackPawn, br: BlackRook, bn: BlackKnight, bb: BlackBishop, bq: BlackQueen, bk: BlackKing,
};

const renderPiece = (piece: Piece | null) => {
  if (!piece) return null;
  const PieceComponent = pieceComponents[`${piece.color}${piece.type}`];
  return PieceComponent ? <PieceComponent /> : null;
};

export const Chessboard: React.FC<ChessboardProps> = ({ board, turn, onMove, validMoves, onSelectPiece, selectedSquare, historyPreview, disabled, previewedMove }) => {
  const currentBoard = historyPreview || board;

  const handleSquareClick = (row: number, col: number) => {
    if (disabled || historyPreview) return; // Disable clicks during history preview or if disabled

    if (selectedSquare) {
      const isValidMove = validMoves.some(move => move.to[0] === row && move.to[1] === col);
      if (isValidMove) {
        onMove(selectedSquare, [row, col]);
      } else {
        const piece = currentBoard[row][col];
        if (piece && piece.color === turn) {
          onSelectPiece([row, col]);
        } else {
            onSelectPiece([-1,-1]); // Deselect
        }
      }
    } else {
      const piece = currentBoard[row][col];
      if (piece && piece.color === turn) {
        onSelectPiece([row, col]);
      }
    }
  };

  const arrow = previewedMove && {
      x1: previewedMove.from[1] * 12.5 + 6.25,
      y1: previewedMove.from[0] * 12.5 + 6.25,
      x2: previewedMove.to[1] * 12.5 + 6.25,
      y2: previewedMove.to[0] * 12.5 + 6.25,
  }

  return (
    <CornerBox className="aspect-square w-full">
      <div className="relative w-full h-full border-2 border-cyan-400 cyan-glow bg-gray-900/50 p-2">
       <div className="grid grid-cols-8 gap-0 aspect-square">
        {currentBoard.map((rowArr, row) =>
          rowArr.map((piece, col) => {
            const isLightSquare = (row + col) % 2 !== 0;
            const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
            const isPossibleMove = validMoves.some(move => move.to[0] === row && move.to[1] === col);

            return (
              <div
                key={`${row}-${col}`}
                className={`aspect-square flex justify-center items-center relative transition-colors duration-200 
                  ${isLightSquare ? 'bg-gray-600/40' : 'bg-gray-800/40'}
                  ${disabled ? 'cursor-not-allowed' : (!historyPreview && 'cursor-pointer')}
                  ${isSelected ? 'bg-cyan-400/50' : ''}`}
                onClick={() => handleSquareClick(row, col)}
              >
                <div className="w-full h-full p-1">
                    {renderPiece(piece)}
                </div>
                {isPossibleMove && !historyPreview && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1/4 h-1/4 rounded-full bg-cyan-400/50 cyan-glow"></div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {arrow && (
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
               <defs>
                   <marker 
                        id="arrowhead" 
                        markerWidth="2.5" 
                        markerHeight="2" 
                        refY="1" 
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                       <polygon points="0 0, 2.5 1, 0 2" className="fill-yellow-400" />
                   </marker>
               </defs>
               <line 
                   x1={`${arrow.x1}%`} 
                   y1={`${arrow.y1}%`} 
                   x2={`${arrow.x2}%`} 
                   y2={`${arrow.y2}%`} 
                   strokeWidth="8" 
                   className="stroke-yellow-400"
                   markerEnd="url(#arrowhead)"
                   style={{ filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.9))' }}
                />
           </svg>
       )}
    </div>
    </CornerBox>
  );
};