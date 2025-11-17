
import type { Board, Piece, Debuff, Move, DebuffSelectionOptions } from '../types';
import { PlayerColor, PieceType, DebuffId } from '../types';

export function getInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  const placePiece = (row: number, col: number, type: Piece['type'], color: PlayerColor) => {
    board[row][col] = { type, color };
  };

  // Pawns
  for (let i = 0; i < 8; i++) {
    placePiece(1, i, PieceType.PAWN, PlayerColor.BLACK);
    placePiece(6, i, PieceType.PAWN, PlayerColor.WHITE);
  }

  // Rooks
  placePiece(0, 0, PieceType.ROOK, PlayerColor.BLACK); placePiece(0, 7, PieceType.ROOK, PlayerColor.BLACK);
  placePiece(7, 0, PieceType.ROOK, PlayerColor.WHITE); placePiece(7, 7, PieceType.ROOK, PlayerColor.WHITE);
  
  // Knights
  placePiece(0, 1, PieceType.KNIGHT, PlayerColor.BLACK); placePiece(0, 6, PieceType.KNIGHT, PlayerColor.BLACK);
  placePiece(7, 1, PieceType.KNIGHT, PlayerColor.WHITE); placePiece(7, 6, PieceType.KNIGHT, PlayerColor.WHITE);

  // Bishops
  placePiece(0, 2, PieceType.BISHOP, PlayerColor.BLACK); placePiece(0, 5, PieceType.BISHOP, PlayerColor.BLACK);
  placePiece(7, 2, PieceType.BISHOP, PlayerColor.WHITE); placePiece(7, 5, PieceType.BISHOP, PlayerColor.WHITE);

  // Queens
  placePiece(0, 3, PieceType.QUEEN, PlayerColor.BLACK);
  placePiece(7, 3, PieceType.QUEEN, PlayerColor.WHITE);

  // Kings
  placePiece(0, 4, PieceType.KING, PlayerColor.BLACK);
  placePiece(7, 4, PieceType.KING, PlayerColor.WHITE);

  return board;
}

function isWithinBounds(r: number, c: number): boolean {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getPawnMoves(board: Board, r: number, c: number, color: PlayerColor): [number, number][] {
    const moves: [number, number][] = [];
    const direction = color === PlayerColor.WHITE ? -1 : 1;
    const startRow = color === PlayerColor.WHITE ? 6 : 1;

    // 1 step forward
    if (isWithinBounds(r + direction, c) && !board[r + direction][c]) {
        moves.push([r + direction, c]);
        // 2 steps forward from start
        if (r === startRow && isWithinBounds(r + 2 * direction, c) && !board[r + 2 * direction][c]) {
            moves.push([r + 2 * direction, c]);
        }
    }
    // Captures
    const captureCols = [c - 1, c + 1];
    for (const dCol of captureCols) {
        if (isWithinBounds(r + direction, dCol) && board[r + direction][dCol] && board[r + direction][dCol]?.color !== color) {
            moves.push([r + direction, dCol]);
        }
    }
    return moves;
}

function getSlidingMoves(board: Board, r: number, c: number, color: PlayerColor, directions: [number, number][]): [number, number][] {
    const moves: [number, number][] = [];
    for (const [dr, dc] of directions) {
        let currR = r + dr;
        let currC = c + dc;
        while(isWithinBounds(currR, currC)) {
            const piece = board[currR][currC];
            if (piece) {
                if (piece.color !== color) {
                    moves.push([currR, currC]);
                }
                break;
            }
            moves.push([currR, currC]);
            currR += dr;
            currC += dc;
        }
    }
    return moves;
}

function getKnightMoves(board: Board, r: number, c: number, color: PlayerColor): [number, number][] {
    const moves: [number, number][] = [];
    const directions: [number, number][] = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of directions) {
        const newR = r + dr;
        const newC = c + dc;
        if (isWithinBounds(newR, newC) && board[newR][newC]?.color !== color) {
            moves.push([newR, newC]);
        }
    }
    return moves;
}

function getKingMoves(board: Board, r: number, c: number, color: PlayerColor): [number, number][] {
    const moves: [number, number][] = [];
    const directions: [number, number][] = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (const [dr, dc] of directions) {
        const newR = r + dr;
        const newC = c + dc;
        if (isWithinBounds(newR, newC) && board[newR][newC]?.color !== color) {
            moves.push([newR, newC]);
        }
    }
    return moves;
}

export function getValidMoves(board: Board, from: [number, number], debuff: Debuff, options: DebuffSelectionOptions): { to: [number, number] }[] {
    const [r, c] = from;
    const piece = board[r][c];
    if (!piece) return [];
    
    if (!debuff.canSelectPiece(piece, options, board)) {
        return [];
    }
    
    let moves: [number, number][] = [];
    switch (piece.type) {
        case PieceType.PAWN: moves = getPawnMoves(board, r, c, piece.color); break;
        case PieceType.ROOK: moves = getSlidingMoves(board, r, c, piece.color, [[-1,0],[1,0],[0,-1],[0,1]]); break;
        case PieceType.BISHOP: moves = getSlidingMoves(board, r, c, piece.color, [[-1,-1],[-1,1],[1,-1],[1,1]]); break;
        case PieceType.QUEEN: moves = getSlidingMoves(board, r, c, piece.color, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); break;
        case PieceType.KNIGHT: moves = getKnightMoves(board, r, c, piece.color); break;
        case PieceType.KING: moves = getKingMoves(board, r, c, piece.color); break;
    }

    const movesAsObjects = moves.map(to => ({ to }));

    return debuff.filterMoves(movesAsObjects, from, board, piece);
}

export function createMove(board: Board, from: [number, number], to: [number, number], activeDebuff: DebuffId): Move {
    const piece = board[from[0]][from[1]]!;
    const capturedPiece = board[to[0]][to[1]];
    const file = 'abcdefgh';
    const rank = '87654321';
    
    let notation = '';
    if (piece.type !== 'p') {
        notation += piece.type.toUpperCase();
    }
    notation += file[from[1]] + rank[from[0]];
    notation += capturedPiece ? 'x' : '-';
    notation += file[to[1]] + rank[to[0]];

    const boardBefore = JSON.parse(JSON.stringify(board));

    return { from, to, piece, notation, boardBefore, activeDebuff };
}