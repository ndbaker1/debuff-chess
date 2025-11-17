import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const PawnIcon = () => <IconWrapper><path d="M12 1.5c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6zM7 23.5h10v-2H7v2zM2 9.5h20v2H2z"/></IconWrapper>;
export const KnightIcon = () => <IconWrapper><path d="M23 11.5c0-3.31-2.69-6-6-6h-1c-1.11 0-2 .89-2 2v4H4c-1.11 0-2 .89-2 2v2c0 1.11.89 2 2 2h2v-4h4v4h2v-2h5c1.11 0 2-.89 2-2v-2zM8 23.5h10v-2H8v2z"/></IconWrapper>;
export const KingIcon = () => <IconWrapper><path d="M12 1.5L9 5.5h6L12 1.5zM2 7.5h20v2H2zM4 11.5h16v10H4v-10zM11 13.5h2v6h-2v-6z"/></IconWrapper>;
export const QueenIcon = () => <IconWrapper><path d="M2 7.5h20v2H2zM12 1.5L8 5.5h8L12 1.5zM4 11.5h16v10H4v-10z"/></IconWrapper>;
export const CaptureIcon = () => <IconWrapper><path d="M4 4L20 20M20 4L4 20"/></IconWrapper>;
export const ForwardIcon = () => <IconWrapper><path d="M12 20V4M18 10l-6-6-6 6"/></IconWrapper>;
export const CenterIcon = () => <IconWrapper><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M3 12h2m14 0h2m-9-9v2m0 14v2"/></IconWrapper>;
export const RangeIcon = () => <IconWrapper><path d="M3 8V5a2 2 0 012-2h3m11 0h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3"/><circle cx="12" cy="12" r="3"/></IconWrapper>;
export const BackwardsIcon = () => <IconWrapper><path d="M12 4v16m6-6l-6 6-6-6"/></IconWrapper>;
export const DiagonalIcon = () => <IconWrapper><path d="M18 18L6 6m12 0L6 18"/></IconWrapper>;
export const OrthogonalIcon = () => <IconWrapper><path d="M12 4v16M4 12h16"/></IconWrapper>;
export const DarkSquareIcon = () => <IconWrapper><path d="M12 3v18M3 12h18"/><rect x="3" y="3" width="9" height="9" fill="currentColor"/><rect x="12" y="12" width="9" height="9" fill="currentColor"/></IconWrapper>;