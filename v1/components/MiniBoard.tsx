import React, { useMemo } from 'react';
import { type Move, type PlayerColor } from '../types';
import PieceComponent from './icons/Piece';
import { type Piece } from 'chess.js';

interface MiniBoardProps {
    fen: string;
    move: Move;
    color: PlayerColor;
}

const parseFen = (fen: string): (Piece | null)[][] => {
    const board: (Piece | null)[][] = [];
    const fenBoard = fen.split(' ')[0];
    const ranks = fenBoard.split('/');

    for (const rank of ranks) {
        const row: (Piece | null)[] = [];
        for (const char of rank) {
            if (isNaN(parseInt(char, 10))) {
                const color = char === char.toUpperCase() ? 'w' : 'b';
                const type = char.toLowerCase();
                row.push({ color, type } as Piece);
            } else {
                for (let i = 0; i < parseInt(char, 10); i++) {
                    row.push(null);
                }
            }
        }
        board.push(row);
    }
    return board;
};

const squareToCoords = (square: string, squareSize: number): { x: number, y: number } => {
    const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = 8 - parseInt(square.charAt(1), 10);
    return {
        x: file * squareSize + squareSize / 2,
        y: rank * squareSize + squareSize / 2,
    };
};

const MiniBoard: React.FC<MiniBoardProps> = ({ fen, move, color }) => {
    const board = useMemo(() => parseFen(fen), [fen]);
    const boardSize = 256;
    const squareSize = boardSize / 8;

    const fromCoords = squareToCoords(move.from, squareSize);
    const toCoords = squareToCoords(move.to, squareSize);
    const arrowColor = color === 'w' ? 'var(--cyan)' : 'var(--magenta)';

    return (
        <div className="relative border border-[var(--cyan)]" style={{ width: boardSize, height: boardSize }}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((piece, colIndex) => {
                        const isLight = (rowIndex + colIndex) % 2 !== 0;
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className="relative"
                                style={{ 
                                    width: squareSize, 
                                    height: squareSize,
                                    backgroundColor: isLight ? 'rgba(57, 61, 94, 0.8)' : 'rgba(40, 42, 66, 0.8)' 
                                }}
                            >
                                {piece && <div className="p-0.5"><PieceComponent piece={piece} /></div>}
                            </div>
                        );
                    })}
                </div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: `drop-shadow(0 0 2px ${arrowColor})` }}>
                <defs>
                    <marker id={`arrowhead-${color}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill={arrowColor} />
                    </marker>
                </defs>
                <line
                    x1={fromCoords.x}
                    y1={fromCoords.y}
                    x2={toCoords.x}
                    y2={toCoords.y}
                    stroke={arrowColor}
                    strokeWidth="3"
                    markerEnd={`url(#arrowhead-${color})`}
                />
            </svg>
        </div>
    );
};

export default MiniBoard;