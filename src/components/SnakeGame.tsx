import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const move = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(move);
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for machine-feel
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(canvas.width, i * CELL_SIZE); ctx.stroke();
    }

    // Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff00ff'; ctx.fillRect(food.x * CELL_SIZE + 4, food.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8); ctx.shadowBlur = 0;

    // Snake (Cyan)
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#00cccc';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      if (i === 0) {
        ctx.shadowBlur = 15; ctx.shadowColor = '#00ffff'; 
        ctx.strokeRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        ctx.shadowBlur = 0;
      }
    });

  }, [snake, food]);

  return (
    <div className="relative screen-tear">
      <div className="glitch-border bg-black">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block grayscaleContrast"
        />

        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20"
            >
              <h2 className="font-display text-2xl glitch-text text-glitch-magenta mb-4">SYSTEM_HALT</h2>
              <p className="font-mono text-xs text-glitch-cyan mb-8 uppercase">Memory Corruption Detected</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-glitch-cyan text-black font-bold uppercase hover:bg-glitch-magenta transition-colors"
              >
                REBOOT_KERNEL
              </button>
            </motion.div>
          )}

          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 cursor-pointer"
              onClick={() => setIsPaused(false)}
            >
              <div className="border-2 border-glitch-cyan p-6 bg-black flex flex-col items-center gap-4">
                <p className="font-display text-xs glitch-text">USER_PROMPT: START</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 border border-glitch-magenta flex items-center justify-center text-[10px]">UP</div>
                  <div className="w-8 h-8 border border-glitch-magenta flex items-center justify-center text-[10px]">DN</div>
                  <div className="w-8 h-8 border border-glitch-magenta flex items-center justify-center text-[10px]">LF</div>
                  <div className="w-8 h-8 border border-glitch-magenta flex items-center justify-center text-[10px]">RT</div>
                </div>
                <p className="font-mono text-[9px] opacity-70">EXECUTE via SPACEBAR</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none scanlines opacity-20"></div>
    </div>
  );
}
