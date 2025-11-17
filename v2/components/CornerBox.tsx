import React from 'react';

interface CornerBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const CornerBox: React.FC<CornerBoxProps> = ({ children, className }) => {
  return (
    <div className={`box-with-corners ${className || ''}`}>
      {children}
      <div className="corner top-left"></div>
      <div className="corner top-right"></div>
      <div className="corner bottom-left"></div>
      <div className="corner bottom-right"></div>
    </div>
  );
};
