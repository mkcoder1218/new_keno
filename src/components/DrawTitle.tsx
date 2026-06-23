import React from 'react';

interface DrawTitleProps {
  roundId: number;
  position: 'left' | 'right';
  id?: string;
}

export const DrawTitle: React.FC<DrawTitleProps> = ({ roundId, position, id }) => {
  return (
    <div className={`draw-title ${position}`} id={id}>
      <span className="draw-word">DRAW</span>
      <span className="draw-id">{roundId}</span>
    </div>
  );
};
