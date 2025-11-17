import type { Debuff, Piece, Board } from "../types";
import { DebuffId, PieceType, PlayerColor } from "../types";
import {
    CorruptedIcon,
    SlowedIcon,
    WeakenedIcon,
    FrozenIcon,
    LimitedIcon,
    ShackledIcon,
    PacifistIcon,
    CowardiceIcon,
    IsolatedIcon,
    NobilityLockIcon,
    BackRankJailIcon,
    ShortFuseIcon,
    GhostingIcon,
} from "../components/Icons";

const NO_DEBUFF: Debuff = {
    id: DebuffId.NONE,
    name: "None",
    description: "No active debuff.",
    icon: () => null,
    canSelectPiece: () => true,
    filterMoves: (moves) => moves,
};

const SLOWED_DEBUFF: Debuff = {
    id: DebuffId.SLOWED,
    name: 'Slowed',
    description: 'Opponent can only move the first piece they touch.',
    icon: SlowedIcon,
    canSelectPiece: (piece, { from, selectedSquare }) => {
        // Allow selection if nothing is selected yet, or if re-selecting the same piece.
        return !selectedSquare || (selectedSquare[0] === from[0] && selectedSquare[1] === from[1]);
    },
    filterMoves: (moves) => moves,
};

const WEAKENED_DEBUFF: Debuff = {
    id: DebuffId.WEAKENED,
    name: 'Weakened',
    description: 'Opponent cannot move their Queen.',
    icon: WeakenedIcon,
    canSelectPiece: (piece) => piece.type !== PieceType.QUEEN,
    filterMoves: (moves) => moves,
};

const CORRUPTED_DEBUFF: Debuff = {
    id: DebuffId.CORRUPTED,
    name: 'Corrupted',
    description: 'Opponent cannot move pieces more than 2 squares.',
    icon: CorruptedIcon,
    canSelectPiece: () => true,
    filterMoves: (moves, from) => {
        const [r, c] = from;
        return moves.filter(({ to }) => Math.abs(to[0] - r) <= 2 && Math.abs(to[1] - c) <= 2);
    }
};

// New Debuffs

const FROZEN_DEBUFF: Debuff = {
    id: DebuffId.FROZEN,
    name: 'Frozen',
    description: 'Opponent cannot move their Knights.',
    icon: FrozenIcon,
    canSelectPiece: (piece) => piece.type !== PieceType.KNIGHT,
    filterMoves: (moves) => moves,
};

const LIMITED_DEBUFF: Debuff = {
    id: DebuffId.LIMITED,
    name: 'Limited',
    description: 'Opponent Rooks can only move up to 3 squares.',
    icon: LimitedIcon,
    canSelectPiece: () => true,
    filterMoves: (moves, from, board, piece) => {
        if (piece.type !== PieceType.ROOK) return moves;
        const [r, c] = from;
        return moves.filter(({ to }) => Math.abs(to[0] - r) <= 3 && Math.abs(to[1] - c) <= 3);
    },
};

const SHACKLED_DEBUFF: Debuff = {
    id: DebuffId.SHACKLED,
    name: 'Shackled',
    description: 'Opponent cannot move their Bishops.',
    icon: ShackledIcon,
    canSelectPiece: (piece) => piece.type !== PieceType.BISHOP,
    filterMoves: (moves) => moves,
};

const PACIFIST_DEBUFF: Debuff = {
    id: DebuffId.PACIFIST,
    name: 'Pacifist',
    description: 'Opponent cannot capture any pieces.',
    icon: PacifistIcon,
    canSelectPiece: () => true,
    filterMoves: (moves, from, board) => {
        return moves.filter(({ to }) => !board[to[0]][to[1]]);
    },
};

const COWARDICE_DEBUFF: Debuff = {
    id: DebuffId.COWARDICE,
    name: 'Cowardice',
    description: 'Opponent cannot move their King.',
    icon: CowardiceIcon,
    canSelectPiece: (piece) => piece.type !== PieceType.KING,
    filterMoves: (moves) => moves,
};

const ISOLATED_DEBUFF: Debuff = {
    id: DebuffId.ISOLATED,
    name: 'Isolated',
    description: 'Opponent can only move pieces not adjacent to friendly pieces.',
    icon: IsolatedIcon,
    canSelectPiece: (piece, { from }, board) => {
        const [r, c] = from;
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (const [dr, dc] of directions) {
            const newR = r + dr;
            const newC = c + dc;
            if (newR >= 0 && newR < 8 && newC >= 0 && newC < 8 && board[newR][newC]?.color === piece.color) {
                return false; // Found adjacent friendly piece
            }
        }
        return true;
    },
    filterMoves: (moves) => moves,
};

const NOBILITY_LOCK_DEBUFF: Debuff = {
    id: DebuffId.NOBILITY_LOCK,
    name: 'Nobility Lock',
    description: 'Opponent can only move Pawns and the King.',
    icon: NobilityLockIcon,
    canSelectPiece: (piece) => piece.type === PieceType.PAWN || piece.type === PieceType.KING,
    filterMoves: (moves) => moves,
};

const BACK_RANK_JAIL_DEBUFF: Debuff = {
    id: DebuffId.BACK_RANK_JAIL,
    name: 'Back Rank Jail',
    description: "Opponent's pieces on their back rank cannot move.",
    icon: BackRankJailIcon,
    canSelectPiece: (piece, { from }) => {
        const backRank = piece.color === PlayerColor.WHITE ? 7 : 0;
        return from[0] !== backRank;
    },
    filterMoves: (moves) => moves,
};

const SHORT_FUSE_DEBUFF: Debuff = {
    id: DebuffId.SHORT_FUSE,
    name: 'Short Fuse',
    description: "Opponent's Pawns cannot move two squares on their first move.",
    icon: ShortFuseIcon,
    canSelectPiece: () => true,
    filterMoves: (moves, from, board, piece) => {
        if (piece.type !== PieceType.PAWN) return moves;
        return moves.filter(({ to }) => Math.abs(to[0] - from[0]) < 2);
    },
};

const GHOSTING_DEBUFF: Debuff = {
    id: DebuffId.GHOSTING,
    name: 'Ghosting',
    description: 'Opponent cannot move pieces to the two center columns.',
    icon: GhostingIcon,
    canSelectPiece: () => true,
    filterMoves: (moves) => {
        return moves.filter(({ to }) => to[1] !== 3 && to[1] !== 4);
    },
};


export const DEBUFFS: Record<DebuffId, Debuff> = {
    [DebuffId.NONE]: NO_DEBUFF,
    [DebuffId.SLOWED]: SLOWED_DEBUFF,
    [DebuffId.WEAKENED]: WEAKENED_DEBUFF,
    [DebuffId.CORRUPTED]: CORRUPTED_DEBUFF,
    [DebuffId.FROZEN]: FROZEN_DEBUFF,
    [DebuffId.LIMITED]: LIMITED_DEBUFF,
    [DebuffId.SHACKLED]: SHACKLED_DEBUFF,
    [DebuffId.PACIFIST]: PACIFIST_DEBUFF,
    [DebuffId.COWARDICE]: COWARDICE_DEBUFF,
    [DebuffId.ISOLATED]: ISOLATED_DEBUFF,
    [DebuffId.NOBILITY_LOCK]: NOBILITY_LOCK_DEBUFF,
    [DebuffId.BACK_RANK_JAIL]: BACK_RANK_JAIL_DEBUFF,
    [DebuffId.SHORT_FUSE]: SHORT_FUSE_DEBUFF,
    [DebuffId.GHOSTING]: GHOSTING_DEBUFF,
};

export const ALL_DEBUFFS: Debuff[] = [
    SLOWED_DEBUFF,
    WEAKENED_DEBUFF,
    CORRUPTED_DEBUFF,
    FROZEN_DEBUFF,
    LIMITED_DEBUFF,
    SHACKLED_DEBUFF,
    PACIFIST_DEBUFF,
    COWARDICE_DEBUFF,
    ISOLATED_DEBUFF,
    NOBILITY_LOCK_DEBUFF,
    BACK_RANK_JAIL_DEBUFF,
    SHORT_FUSE_DEBUFF,
    GHOSTING_DEBUFF,
];