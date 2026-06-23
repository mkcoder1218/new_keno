import React, { useState, useEffect, useMemo } from 'react';
import { PAYTABLE, SCREENSHOT_HIGHLIGHTS } from './constants';
import { RightPanelMode, PayoutRow } from './types';
import { DrawTitle } from './components/DrawTitle';
import { KenoGrid } from './components/KenoGrid';
import { PayoutTable } from './components/PayoutTable';
import { InstructionPanel } from './components/InstructionPanel';

export default function App() {
  // ==========================================
  // States
  // ==========================================
  const [currentRoundId, setCurrentRoundId] = useState<number>(9295);
  // 86 seconds corresponds to 01:26 countdown matching the reference image exactly on initial load
  const [countdown, setCountdown] = useState<number>(86);
  
  // Custom Demo load state matches the exact layout of the screenshot on initial mount
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([6, 11, 14, 21, 25, 31, 62, 64, 75]);

  // Two display modes for the right panel: "payout" or "instruction"
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('payout');

  // ==========================================
  // Timer & Carousel Mode Hooks
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Increment round id and restart TV carousel cycle
          setCurrentRoundId((id) => id + 1);
          return 90; // loop back to 90 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Switches between modes automatically every 8 seconds for real previewing
  useEffect(() => {
    const modeInterval = setInterval(() => {
      setRightPanelMode((prev) => (prev === 'payout' ? 'instruction' : 'payout'));
    }, 8000);
    return () => clearInterval(modeInterval);
  }, []);

  // ==========================================
  // Interactive Action Handlers
  // ==========================================
  const handleCellClick = (num: number) => {
    // If user clicks a tile in instruction mode, auto-switch to payout mode for feedback
    if (rightPanelMode === 'instruction') {
      setRightPanelMode('payout');
    }

    // Disable initial screenshot demo mode on interaction
    if (isDemo) {
      setIsDemo(false);
      setSelectedNumbers([num]);
      return;
    }

    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((x) => x !== num);
      } else {
        if (prev.length >= 10) return prev; // Limit to max pick 10
        return [...prev, num].sort((a, b) => a - b);
      }
    });
  };

  const handleTailsClear = () => {
    setIsDemo(false);
    setSelectedNumbers([]);
  };

  // ==========================================
  // Layout Logic Computations
  // ==========================================
  const pickCount = isDemo ? 9 : selectedNumbers.length;

  const pickText = useMemo(() => {
    if (pickCount === 0) return "PICK 1 TO 10";
    return `PICK ${pickCount}`;
  }, [pickCount]);

  const activePaytableRows = useMemo<PayoutRow[]>(() => {
    const config = PAYTABLE[pickCount] || {};
    return Object.entries(config)
      .map(([hits, win]) => ({
        hits: parseInt(hits),
        win: win
      }))
      .sort((a, b) => b.hits - a.hits);
  }, [pickCount]);

  const isCellSelected = (num: number) => {
    // In instruction mode, the left grid shows all numbers unselected/dim red like the reference video/image
    if (rightPanelMode === 'instruction') {
      return false;
    }
    if (isDemo) {
      return SCREENSHOT_HIGHLIGHTS.includes(num);
    }
    return selectedNumbers.includes(num);
  };

  // 01:26 layout format
  const formatCountdown = (time: number) => {
    const min = Math.floor(time / 60).toString().padStart(2, '0');
    const sec = (time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="broadcast-frame select-none" id="keno-broadcast-root">
      
      {/* ==========================================
          LEFT SECTION: VIBRANT RED KENO TV GRID (58%)
          ========================================== */}
      <section className="left-broadcast-grid" id="tv-left-grid">
        
        {/* Top Header Panel Line */}
        <div className="flex justify-between items-center z-10 select-none px-2 pt-1">
          {/* Exactly DRAW 9295 non-italic block text */}
          <DrawTitle roundId={currentRoundId} position="left" id="grid-header-title" />

          {/* Faint Dark Red Accent Area representing HEADS block spot in screenshot - strictly no text & almost invisible */}
          <div className="w-[124px] h-[40px] bg-[#3a0000]/15 border border-[#6a0000]/5 rounded-md opacity-[0.18]" />
        </div>

        {/* 10 x 8 Number Grid Matrix */}
        <KenoGrid isCellSelected={isCellSelected} onCellClick={handleCellClick} />

        {/* Bottom Logo & Action panel */}
        <div className="flex items-center justify-between z-10 select-none px-2 mb-1">
          {/* Glowing Red Neon display logo */}
          <div className="keno-logo select-none">
            KENO
          </div>

          {/* Golden glossy bottom-right action button only in payout mode */}
          {rightPanelMode === 'payout' ? (
            <button
              id="tails-button-action"
              onClick={handleTailsClear}
              className="tails-metallic-button text-black text-xl lg:text-2xl px-12 lg:px-16 py-1.5 rounded-lg active:scale-95 cursor-pointer animate-fade-in"
            >
              TAILS
            </button>
          ) : (
            <div className="w-[124px] lg:w-[154px] h-[40px]" />
          )}
        </div>

      </section>

      {/* ==========================================
          MIDDLE VERTICAL BINDING DIVIDER
          ========================================== */}
      <div className="vertical-divider" />

      {/* ==========================================
          RIGHT SECTION: BROADCAST PARAMS & PAYOUT / INSTRUCTIONS (42%)
          ========================================== */}
      <section className="right-broadcast-panel" id="tv-right-panel">
        
        {/* Top Header Draw identifier */}
        <div className="text-center w-full">
          <DrawTitle roundId={currentRoundId + 1} position="right" id="next-draw-header" />
        </div>

        {/* Huge glowing timer countdown */}
        <div className="text-center w-full">
          <span className="timer">
            {formatCountdown(countdown)}
          </span>
        </div>

        {rightPanelMode === 'payout' ? (
          <PayoutTable pickText={pickText} activePaytableRows={activePaytableRows} />
        ) : (
          /* Mode 2: INSTRUCTION MODE with huge centered text details */
          <InstructionPanel />
        )}

      </section>

    </div>
  );
}
