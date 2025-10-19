import { useRef, useEffect, useState } from 'react';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  landed: boolean;
  slot: number | null;
}

interface Peg {
  x: number;
  y: number;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PEG_RADIUS = 6;
const BALL_RADIUS = 8;
const ROWS = 8;
const COLS = 7;
const GRAVITY = 0.3;
const BOUNCE = 0.8;
const FRICTION = 0.99;
const SLOTS = 7;
const MULTIPLIERS = [0.5, 1, 2, 5, 2, 1, 0.5];

function generatePegs(): Peg[] {
  const pegs: Peg[] = [];
  const startY = 60;
  const rowSpacing = 40;
  const pegSpacing = CANVAS_WIDTH / (COLS + 1);
  for (let row = 0; row < ROWS; row++) {
    const peg_count = COLS + (row % 2);
    const offset = row % 2 === 0 ? 0 : pegSpacing / 2;
    for (let col = 0; col < peg_count; col++) {
      pegs.push({
        x: offset + (col + 0.5) * pegSpacing,
        y: startY + row * rowSpacing,
      });
    }
  }
  return pegs;
}

export default function PlinkoCanvas({ onBallLanded, dropCount }: { onBallLanded: (slot: number, multiplier: number) => void, dropCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const pegs = useRef(generatePegs());
  const ballId = useRef(0);

  useEffect(() => {
    if (dropCount > 0) {
      setBalls((prev) => [
        ...prev,
        {
          id: ballId.current++,
          x: CANVAS_WIDTH / 2,
          y: 20,
          vx: (Math.random() - 0.5) * 2,
          vy: 0,
          landed: false,
          slot: null,
        },
      ]);
    }
    // eslint-disable-next-line
  }, [dropCount]);

  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          if (ball.landed) return ball;
          let { x, y, vx, vy } = ball;
          vy += GRAVITY;
          vx *= FRICTION;
          x += vx;
          y += vy;
          if (x - BALL_RADIUS < 0) {
            x = BALL_RADIUS;
            vx = Math.abs(vx) * BOUNCE;
          }
          if (x + BALL_RADIUS > CANVAS_WIDTH) {
            x = CANVAS_WIDTH - BALL_RADIUS;
            vx = -Math.abs(vx) * BOUNCE;
          }
          pegs.current.forEach((peg) => {
            const dx = x - peg.x;
            const dy = y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = BALL_RADIUS + PEG_RADIUS;
            if (dist < minDist) {
              const angle = Math.atan2(dy, dx);
              x = peg.x + Math.cos(angle) * minDist;
              y = peg.y + Math.sin(angle) * minDist;
              vx = Math.cos(angle) * 4;
              vy = Math.sin(angle) * 4;
            }
          });
          if (y + BALL_RADIUS >= CANVAS_HEIGHT - 40) {
            const landedSlot = Math.floor((x / CANVAS_WIDTH) * SLOTS);
            onBallLanded(landedSlot, MULTIPLIERS[landedSlot] || 1);
            return { ...ball, x, y: CANVAS_HEIGHT - 40, vx, vy, landed: true, slot: landedSlot };
          }
          return { ...ball, x, y, vx, vy };
        })
      );
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [balls.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Board
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Pegs
    ctx.fillStyle = '#6366f1';
    pegs.current.forEach((peg) => {
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });
    // Slots
    const slotWidth = CANVAS_WIDTH / SLOTS;
    for (let i = 0; i < SLOTS; i++) {
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(i * slotWidth, CANVAS_HEIGHT - 32, slotWidth, 32);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`x${MULTIPLIERS[i]}`, (i + 0.5) * slotWidth, CANVAS_HEIGHT - 16);
    }
    // Balls
    balls.forEach((ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    });
  }, [balls]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-2xl shadow-lg border-4 border-indigo-300 bg-blue-100"
      />
    </div>
  );
}
