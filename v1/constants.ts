
import { type Debuff } from './types';
import { type Chess, type Square } from 'chess.js';
import { PawnIcon, KnightIcon, KingIcon, QueenIcon, CaptureIcon, ForwardIcon, CenterIcon, RangeIcon, BackwardsIcon, DiagonalIcon, OrthogonalIcon, DarkSquareIcon } from './components/icons/DebuffIcons';


const isLightSquare = (square: Square): boolean => {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square.charAt(1), 10) - 1;
  return (file + rank) % 2 !== 0;
};

export const DEBUFFS: Debuff[] = [
  {
    id: 'no-dark-square-move',
    name: 'Shadow Ban',
    description: 'Opponent cannot move a piece TO a dark square.',
    validate: (move) => !isLightSquare(move.to),
    icon: DarkSquareIcon,
  },
  {
    id: 'pawn-stasis',
    name: 'Pawn Stasis',
    description: 'Opponent cannot move any pawns.',
    validate: (move, game) => {
      const piece = game.get(move.from);
      return piece?.type !== 'p';
    },
    icon: PawnIcon,
  },
  {
    id: 'knight-priority',
    name: "Knight's Vow",
    description: 'Opponent must move a knight, if a legal knight move is available.',
    validate: (move, game) => {
      const piece = game.get(move.from);
      const possibleMoves = game.moves({ verbose: true });
      const canMoveKnight = possibleMoves.some(m => m.piece === 'n');
      if (canMoveKnight) {
        return piece?.type === 'n';
      }
      return true;
    },
    icon: KnightIcon,
  },
  {
    id: 'king-uncastlable',
    name: 'Royal Decree',
    description: 'Opponent cannot castle this turn.',
    validate: (move, game) => {
      const piece = game.get(move.from);
      if (piece?.type !== 'k') return true;
      const fromIndex = 'abcdefgh'.indexOf(move.from[0]);
      const toIndex = 'abcdefgh'.indexOf(move.to[0]);
      return Math.abs(fromIndex - toIndex) < 2;
    },
    icon: KingIcon,
  },
    {
    id: 'no-captures',
    name: 'Peace Treaty',
    description: 'Opponent cannot capture any pieces this turn.',
    validate: (move, game) => {
      return !game.get(move.to);
    },
    icon: CaptureIcon,
  },
  {
    id: 'forward-only',
    name: 'Onward!',
    description: 'Pieces can only move forward relative to their side.',
    validate: (move, game) => {
        const piece = game.get(move.from);
        if (!piece) return false;
        
        const fromRank = parseInt(move.from[1], 10);
        const toRank = parseInt(move.to[1], 10);
        
        if (piece.color === 'w') {
            return toRank > fromRank;
        } else {
            return toRank < fromRank;
        }
    },
    icon: ForwardIcon,
  },
  {
    id: 'queen-command',
    name: "Queen's Command",
    description: 'Opponent must move their queen, if a legal queen move is available.',
    validate: (move, game) => {
      const piece = game.get(move.from);
      const canMoveQueen = game.moves({ verbose: true }).some(m => m.piece === 'q');
      if (canMoveQueen) {
        return piece?.type === 'q';
      }
      return true;
    },
    icon: QueenIcon,
  },
  {
    id: 'central-phobia',
    name: 'Central Phobia',
    description: 'Opponent cannot move a piece TO a central square (d4, e4, d5, e5).',
    validate: (move) => {
      const centerSquares: Square[] = ['d4', 'e4', 'd5', 'e5'];
      return !centerSquares.includes(move.to);
    },
    icon: CenterIcon,
  },
  {
    id: 'limited-range',
    name: 'Limited Range',
    description: 'Pieces can only move a maximum of 2 squares away.',
    validate: (move) => {
      const fromFile = move.from.charCodeAt(0);
      const toFile = move.to.charCodeAt(0);
      const fromRank = parseInt(move.from[1], 10);
      const toRank = parseInt(move.to[1], 10);
      const fileDist = Math.abs(fromFile - toFile);
      const rankDist = Math.abs(fromRank - toRank);
      return Math.max(fileDist, rankDist) <= 2;
    },
    icon: RangeIcon,
  },
  {
    id: 'no-cowardice',
    name: 'No Cowardice',
    description: 'Pieces cannot move backwards (sideways is allowed).',
    validate: (move, game) => {
      const piece = game.get(move.from);
      if (!piece) return false;
      const fromRank = parseInt(move.from[1], 10);
      const toRank = parseInt(move.to[1], 10);
      if (piece.color === 'w') {
        return toRank >= fromRank;
      } else {
        return toRank <= fromRank;
      }
    },
    icon: BackwardsIcon,
  },
  {
    id: 'diagonal-denial',
    name: 'Diagonal Denial',
    description: 'Opponent cannot move pieces diagonally.',
    validate: (move) => {
      const fromFile = move.from.charCodeAt(0);
      const toFile = move.to.charCodeAt(0);
      const fromRank = parseInt(move.from[1], 10);
      const toRank = parseInt(move.to[1], 10);
      const isDiagonal = Math.abs(fromFile - toFile) === Math.abs(fromRank - toRank);
      // This logic also correctly handles non-diagonal knight moves
      return !isDiagonal;
    },
    icon: DiagonalIcon,
  },
  {
    id: 'straightjacket',
    name: 'Straightjacket',
    description: 'Opponent cannot move pieces orthogonally (horizontally or vertically).',
    validate: (move) => {
      const isOrthogonal = move.from[0] === move.to[0] || move.from[1] === move.to[1];
       // This logic also correctly handles non-orthogonal knight moves
      return !isOrthogonal;
    },
    icon: OrthogonalIcon,
  }
];