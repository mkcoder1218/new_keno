import React from 'react';

export const InstructionPanel: React.FC = () => {
  return (
    <div className="flex-1 w-full px-4 lg:px-8 flex flex-col justify-center items-center">
      <div className="instruction-box">
        <div className="instruction-line">
          <span className="text-[#ff0000]">20</span> <span className="text-white">BALLS</span>
        </div>
        <div className="instruction-line text-white">
          DRAWN
        </div>
        <div className="instruction-line">
          <span className="text-white">FROM</span> <span className="text-[#ff0000]">80</span>
        </div>
      </div>
    </div>
  );
};
