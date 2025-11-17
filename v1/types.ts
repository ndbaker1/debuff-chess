import { type Chess, type Piece, type Square } from 'chess.js';
import React from 'react';

export type PlayerColor = 'w' | 'b';

export interface Debuff {
  id: string;
  name: string;
  description: string;
  validate: (move: { from: Square; to: Square }, game: Chess) => boolean;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type Move = {
  // FIX: Use the more specific 'Square' type from chess.js instead of 'string' for better type safety and to match the 'validate' function's expectation.
  from: Square;
  to: Square;
  promotion?: string;
};

export type HistoryEntry = {
  fenBefore: string;
  move: Move;
  san: string;
  debuff: Debuff;
  color: PlayerColor;
};

type MoveMessage = {
  type: 'MOVE';
  move: Move;
};

type DebuffMessage = {
  type: 'DEBUFF';
  debuffId: string;
};

type ResetMessage = {
  type: 'RESET';
  isRequest: boolean; // True if it's the initial request, false for the confirmation
};

type StartGameMessage = {
  type: 'START_GAME';
  playerColor: PlayerColor;
}

export type GameMessage = MoveMessage | DebuffMessage | ResetMessage | StartGameMessage;

export type GamePhase = 'menu' | 'setup' | 'connecting' | 'playing' | 'gameOver';