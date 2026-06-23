import React from 'react';

interface KenoGridProps {
  isCellSelected: (num: number) => boolean;
  onCellClick: (num: number) => void;
}

export const KenoGrid: React.FC<KenoGridProps> = ({ isCellSelected, onCellClick }) => {
  return (
    <div 
      className="grid grid-cols-10 gap-x-1.5 gap-y-1 z-10 w-full flex-1 justify-center py-2 max-h-[82%] items-center" 
      id="matrix-keno-wrap"
    >
      {Array.from({ length: 80 }).map((_, idx) => {
        const num = idx + 1;
        const isHighlighted = isCellSelected(num);

        return (
          <button
            id={`cell-btn-${num}`}
            key={`grid-${num}`}
            onClick={() => onCellClick(num)}
            className={`transition-all font-sans select-none outline-none ${
              isHighlighted ? 'cell-keno-highlighted' : 'cell-keno-normal'
            }`}
          >
            <span className={isHighlighted ? 'cell-number-highlighted' : 'cell-number-normal'}>
              {num}
            </span>
          </button>
        );
      })}
    </div>
  );
};
