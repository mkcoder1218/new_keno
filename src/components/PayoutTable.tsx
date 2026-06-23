import React from 'react';
import { PayoutRow } from '../types';

interface PayoutTableProps {
  pickText: string;
  activePaytableRows: PayoutRow[];
}

export const PayoutTable: React.FC<PayoutTableProps> = ({ pickText, activePaytableRows }) => {
  return (
    <>
      {/* Big styled PICK counter display */}
      <div className="text-center w-full">
        <span className="pick-text uppercase">
          {pickText}
        </span>
      </div>

      {/* TV Clear Payout Index Grid with custom widths & spacings requested */}
      <div className="flex-1 w-full flex flex-col justify-start">
        <div className="payout-table select-none">
          {/* Table Headers */}
          <div className="payout-header pb-2 border-b-[4px] border-[#ff0000]/25">
            <span>HITS</span>
            <span>WIN</span>
          </div>

          {/* Table index values */}
          <div className="pt-4 space-y-1.5" id="tv-index-rows">
            {activePaytableRows.length > 0 ? (
              activePaytableRows.map((row) => (
                <div key={`pay-${row.hits}`} className="payout-row animate-fade-in">
                  <span>{row.hits}</span>
                  <span>{row.win.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-zinc-700 text-sm font-sans font-bold tracking-widest uppercase">
                Select numbers to preview payout index
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
