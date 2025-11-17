import React from 'react';

const PIECE_SVG: { [key: string]: string } = {
  wP: "M6 22V20h12v2z M8 20V14h8v6z M6 14v-3h3v3z M15 14v-3h3v3z M9 11V8h6v3z",
  wR: "M5 22V20h14v2z M7 20V8h10v12z M5 8V4h4v4z M10 8V4h4v4z M15 8V4h4v4z",
  wN: "M5 22V20h14v2z M7 20V10h10v10z M17 12V4h-4l-4 4v2h2v2h4z M7 10h2v2H7z",
  wB: "M5 22V20h14v2z M8 20V10h8v10z M12 10L16 3H8z M11 7l1-3 1 3h-2z",
  wQ: "M5 22V20h14v2z M7 20V12h10v8z M5 11L3 6h4l2 5H5z M10.5 11l-2-5h5l2 5h-5z M16 11l-2-5h4l2 5h-4z",
  wK: "M5 22V20h14v2z M7 20V8h10v12z M9 8V4h6v4z M11 4V2h2v2z M10 3h4v1h-4z",
  bP: "M6 22V20h12v2z M8 20V14h8v6z M6 14v-3h3v3z M15 14v-3h3v3z M9 11V8h6v3z",
  bR: "M5 22V20h14v2z M7 20V8h10v12z M5 8V4h4v4z M10 8V4h4v4z M15 8V4h4v4z",
  bN: "M5 22V20h14v2z M7 20V10h10v10z M17 12V4h-4l-4 4v2h2v2h4z M7 10h2v2H7z",
  bB: "M5 22V20h14v2z M8 20V10h8v10z M12 10L16 3H8z M11 7l1-3 1 3h-2z",
  bQ: "M5 22V20h14v2z M7 20V12h10v8z M5 11L3 6h4l2 5H5z M10.5 11l-2-5h5l2 5h-5z M16 11l-2-5h4l2 5h-4z",
  bK: "M5 22V20h14v2z M7 20V8h10v12z M9 8V4h6v4z M11 4V2h2v2z M10 3h4v1h-4z",
};


interface PieceProps {
  piece: {
    type: string;
    color: 'b' | 'w';
  };
}

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
  const path = PIECE_SVG[pieceKey];
  if (!path) return null;

  const isWhite = piece.color === 'w';
  // Black pieces have a magenta glow, white pieces have no glow as per the mockup.
  const glowFilter = isWhite ? 'none' : `drop-shadow(0 0 3px var(--magenta)) drop-shadow(0 0 6px var(--magenta))`;
  const fillColor = isWhite ? 'var(--light-text)' : 'var(--dark-bg)'; // Use dark-bg for solid black pieces

  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" style={{ overflow: 'visible' }}>
      <g 
        fill={fillColor} 
        style={{ filter: glowFilter }}
      >
        <path d={path} />
      </g>
    </svg>
  );
};

export default Piece;
