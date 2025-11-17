import React from 'react';

export enum PieceType {
    PAWN = 'p',
    KNIGHT = 'n',
    BISHOP = 'b',
    ROOK = 'r',
    QUEEN = 'q',
    KING = 'k'
}

export enum PlayerColor {
    WHITE = 'w',
    BLACK = 'b'
}

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  notation: string;
  boardBefore: Board;
  activeDebuff: DebuffId;
}

export enum DebuffId {
    NONE = 'NONE',
    SLOWED = 'SLOWED',
    WEAKENED = 'WEAKENED',
    CORRUPTED = 'CORRUPTED',
    // New Debuffs
    FROZEN = 'FROZEN',
    LIMITED = 'LIMITED',
    SHACKLED = 'SHACKLED',
    PACIFIST = 'PACIFIST',
    COWARDICE = 'COWARDICE',
    ISOLATED = 'ISOLATED',
    NOBILITY_LOCK = 'NOBILITY_LOCK',
    BACK_RANK_JAIL = 'BACK_RANK_JAIL',
    SHORT_FUSE = 'SHORT_FUSE',
    GHOSTING = 'GHOSTING',
}

export interface DebuffSelectionOptions {
    from: [number, number];
    selectedSquare: [number, number] | null;
}

export interface Debuff {
    id: DebuffId;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    canSelectPiece: (piece: Piece, options: DebuffSelectionOptions, board: Board) => boolean;
    filterMoves: (moves: { to: [number, number] }[], from: [number, number], board: Board, piece: Piece) => { to: [number, number] }[];
}