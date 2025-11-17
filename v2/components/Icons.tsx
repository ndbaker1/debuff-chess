
import React from 'react';

// Base piece component to create the glitch effect
const GlitchPiece: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g transform="translate(1 -1)" className="text-[#FF00FF] opacity-80">{children}</g>
    <g transform="translate(-1 1)" className="text-[#00FFFF] opacity-80">{children}</g>
    <g className="text-white">{children}</g>
  </svg>
);

const BlackGlitchPiece: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g transform="translate(1 -1)" className="text-[#FF00FF] opacity-70">{children}</g>
      <g transform="translate(-1 1)" className="text-[#00FFFF] opacity-70">{children}</g>
      <g className="text-gray-900">{children}</g>
    </svg>
  );


export const Pawn: React.FC = () => <path d="M22.5 9C19.5 9 19 12 19 14C19 16 20 18.5 22.5 18.5C25 18.5 26 16 26 14C26 12 25.5 9 22.5 9Z M16 20L30 20L30 25L16 25L16 20Z M14 27L32 27L32 30L14 30L14 27Z M12 32L34 32L34 36L12 36L12 32Z" fill="currentColor"/>;
export const Rook: React.FC = () => <path d="M12 10L16 10L16 14L20 14L20 10L26 10L26 14L30 14L30 10L34 10L34 18L12 18L12 10Z M14 20L32 20L32 30L14 30L14 20Z M12 32L34 32L34 36L12 36L12 32Z" fill="currentColor" />;
export const Knight: React.FC = () => <path d="M18 10C18 10 15 14 15 18C15 22 18 24 18 24L21 24L21 20L25 20C25 20 32 12 32 8C32 4 28 4 28 4L24 8L20 8L18 10Z M16 26L30 26L28 32L18 32L16 26Z M14 34L32 34L32 38L14 38L14 34Z" fill="currentColor"/>;
export const Bishop: React.FC = () => <path d="M22.5 8C20.5 8 19 10 19 12C19 14 20.5 16 22.5 16C24.5 16 26 14 26 12C26 10 24.5 8 22.5 8Z M18 18L28 18L22.5 28L18 18Z M16 30L30 30L30 32L16 32L16 30Z M14 34L32 34L32 38L14 38L14 34Z" fill="currentColor"/>;
export const Queen: React.FC = () => <path d="M12 12L14 24L18 18L22.5 24L27 18L31 24L33 12L12 12Z M18 26L27 26L22.5 32L18 26Z M14 34L32 34L32 38L14 38L14 34Z" fill="currentColor"/>;
export const King: React.FC = () => <path d="M22.5 8L20 14L16 14L16 18L20 18L20 24L25 24L25 18L29 18L29 14L25 14L22.5 8Z M16 26L30 26L30 30L16 30L16 26Z M14 32L32 32L32 36L14 36L14 32Z" fill="currentColor"/>;

export const WhitePawn: React.FC = () => <GlitchPiece><Pawn /></GlitchPiece>;
export const WhiteRook: React.FC = () => <GlitchPiece><Rook /></GlitchPiece>;
export const WhiteKnight: React.FC = () => <GlitchPiece><Knight /></GlitchPiece>;
export const WhiteBishop: React.FC = () => <GlitchPiece><Bishop /></GlitchPiece>;
export const WhiteQueen: React.FC = () => <GlitchPiece><Queen /></GlitchPiece>;
export const WhiteKing: React.FC = () => <GlitchPiece><King /></GlitchPiece>;

export const BlackPawn: React.FC = () => <BlackGlitchPiece><Pawn /></BlackGlitchPiece>;
export const BlackRook: React.FC = () => <BlackGlitchPiece><Rook /></BlackGlitchPiece>;
export const BlackKnight: React.FC = () => <BlackGlitchPiece><Knight /></BlackGlitchPiece>;
export const BlackBishop: React.FC = () => <BlackGlitchPiece><Bishop /></BlackGlitchPiece>;
export const BlackQueen: React.FC = () => <BlackGlitchPiece><Queen /></BlackGlitchPiece>;
export const BlackKing: React.FC = () => <BlackGlitchPiece><King /></BlackGlitchPiece>;

export const KingLogo = ({className, style}: {className?: string, style?: React.CSSProperties}) => (
    <svg className={className} style={style} viewBox="0 0 45 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <King />
    </svg>
);


export const SlowedIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H9V8h2v6h2v2zm-2-8V6h2v2h-2z"/>
    </svg>
);

export const WeakenedIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35zM7.5 5C5.52 5 4 6.52 4 8.5c0 2.73 2.5 5.14 7 8.89l1 1 1-1c4.5-3.75 7-6.16 7-8.89 0-1.98-1.52-3.5-3.5-3.5-1.54 0-2.94.99-3.5 2.37h-2C9.44 5.99 8.04 5 6.5 5z"/>
    </svg>
);

export const CorruptedIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    </svg>
);

// New Debuff Icons
export const FrozenIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 11h-4.28l1.42-1.42c.39-.39.39-1.02 0-1.41a.996.996 0 00-1.41 0L12 10.95 9.21 8.17c-.39-.39-1.02-.39-1.41 0a.996.996 0 000 1.41L9.28 11H5c-.55 0-1 .45-1 1s.45 1 1 1h4.28l-1.42 1.42c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.05l2.79 2.79c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L14.72 13H19c.55 0 1-.45 1-1s-.45-1-1-1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
);
export const LimitedIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm-2-4V8h2v4h-2zm1-6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 6h.01v.01H12V12zM15 11h-2v2h2v-2zm0-4h-2v2h2V7zM9 11H7v2h2v-2zm0-4H7v2h2V7z" />
    </svg>
);
export const ShackledIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h6v2H8v-2z" />
    </svg>
);
export const PacifistIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.28 18.27L5.41 11.4c-.78-.78-.78-2.05 0-2.83l.03-.03c.78-.78 2.05-.78 2.83 0l1.18 1.18L12 12.28l4.55-4.55 1.18-1.18c.78-.78 2.05-.78 2.83 0l.03.03c.78.78.78 2.05 0 2.83L13.7 18.27c-.39.39-1.02.39-1.42 0zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
);
export const CowardiceIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 6.5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zM8.5 11h-3V9h3v2zm9-2h-3v2h3V9zm-5 10.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 13c-2.42 0-4.5 1.72-4.95 4H4v-2.38c0-1.99 1.62-3.62 3.61-3.62h.78c.31-.72.76-1.39 1.32-1.95L8.5 8.08V7.5c0-.83.67-1.5 1.5-1.5h.09c.67.67 1.58 1 2.5 1s1.83-.33 2.5-1h.09c.83 0 1.5.67 1.5 1.5v.58l-1.21 1.07c.56.56 1.01 1.23 1.32 1.95h.78c1.99 0 3.61 1.63 3.61 3.62V17h-3.05c-.45-2.28-2.53-4-4.95-4z" />
    </svg>
);
export const IsolatedIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
);
export const NobilityLockIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM6 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-3-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
);
export const BackRankJailIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
    </svg>
);
export const ShortFuseIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-5H8l4-4 4 4h-3v5h-2z" />
    </svg>
);
export const GhostingIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-2 4h8v2H8v-2z" />
    </svg>
);