import { useState } from 'react';

const SLOT_COUNT = 7;
const ROWS = 8;
const MULTIPLIERS = [0.5, 1, 2, 5, 2, 1, 0.5];

function getRandomPath() {
  // Simulate a random path for the ball
  let slot = Math.floor(SLOT_COUNT / 2);
  for (let i = 0; i < ROWS; i++) {
    slot += Math.random() < 0.5 ? -1 : 1;
    slot = Math.max(0, Math.min(SLOT_COUNT - 1, slot));
  }
  return slot;
}

export default function PlinkoBoard({ onDrop }: { onDrop: (slot: number, multiplier: number) => void }) {
  const [dropping, setDropping] = useState(false);
  const [ballSlot, setBallSlot] = useState<number | null>(null);

  function handleDrop() {
    if (dropping) return;
    setDropping(true);
    const slot = getRandomPath();
    setTimeout(() => {
      setBallSlot(slot);
      setDropping(false);
      onDrop(slot, MULTIPLIERS[slot]);
    }, 1200);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-[500px] bg-gradient-to-b from-blue-100 to-blue-300 rounded-2xl shadow-lg p-4 flex flex-col justify-end items-center">
        {/* Centered Pegs Triangle */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 z-10" style={{ width: `${SLOT_COUNT * 48}px`, height: '80%' }}>
          {[...Array(ROWS)].map((_, row) => {
            const pegsInRow = row + 1;
            return (
              <div
                key={row}
                className="flex justify-center items-center"
                style={{
                  position: 'absolute',
                  top: `${(row / ROWS) * 80}%`,
                  left: `${((SLOT_COUNT - pegsInRow) * 24)}px`,
                  width: `${pegsInRow * 48}px`,
                  height: '32px',
                }}
              >
                {[...Array(pegsInRow)].map((_, peg) => (
                  <div key={peg} className="w-4 h-4 bg-indigo-400 rounded-full shadow mx-2 opacity-80" />
                ))}
              </div>
            );
          })}
        </div>
        {/* Ball */}
        {(dropping || ballSlot !== null) && (
          <div
            className="absolute z-20 transition-all duration-700"
            style={{
              left: `calc(50% + ${(ballSlot !== null ? ballSlot : Math.floor(SLOT_COUNT / 2)) * 48}px)`,
              top: dropping ? '0%' : '80%',
              transform: 'translate(-50%, 0)',
            }}
          >
            <div className="w-8 h-8 bg-red-400 rounded-full shadow-lg border-4 border-white" />
          </div>
        )}
        {/* Centered Slots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-between items-end" style={{ width: `${SLOT_COUNT * 48}px` }}>
          {MULTIPLIERS.map((mult, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-8 bg-indigo-600 rounded-b-xl flex items-center justify-center text-white font-bold shadow-lg">
                x{mult}
              </div>
              <div className="w-2 h-8 bg-indigo-400" />
            </div>
          ))}
        </div>
      </div>
      <button
        className="mt-8 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300 disabled:opacity-50"
        onClick={handleDrop}
        disabled={dropping}
      >
        {dropping ? 'Dropping...' : 'Drop Ball'}
      </button>
    </div>
  );
}
