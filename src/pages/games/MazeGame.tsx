import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Award, RefreshCw, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const generateMaze = (size: number) => {
  const oddSize = size % 2 === 0 ? size + 1 : size;
  const grid = Array(oddSize).fill(null).map(() => Array(oddSize).fill(1));

  const carvePassages = (cx: number, cy: number) => {
    const directions = [[0, -2], [0, 2], [-2, 0], [2, 0]];
    directions.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx > 0 && nx < oddSize -1 && ny > 0 && ny < oddSize -1 && grid[ny][nx] === 1) {
        grid[cy + dy / 2][cx + dx / 2] = 0;
        grid[ny][nx] = 0;
        carvePassages(nx, ny);
      }
    }
  };
  
  const startX = Math.floor(Math.random() * (oddSize / 2)) * 2 + 1;
  const startY = Math.floor(Math.random() * (oddSize / 2)) * 2 + 1;
  grid[startY][startX] = 0;
  carvePassages(startX, startY);

  grid[1][0] = 0;
  grid[1][1] = 0;
  grid[oddSize - 2][oddSize - 1] = 0;
  grid[oddSize - 2][oddSize - 2] = 0;

  return grid;
};

const MAZE_SIZE = 15;
const GAME_DURATION = 45;

const GhatotkachaIcon = () => (
  <div className="text-2xl animate-bounce">👹</div>
);

const PortalIcon = () => (
  <div className="text-2xl animate-pulse">🌀</div>
);

const MazeGame = () => {
  const navigate = useNavigate();
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  
  const exitPos = useMemo(() => ({ x: MAZE_SIZE - 2, y: MAZE_SIZE - 2 }), []);

  const restartGame = useCallback(() => {
    setMaze(generateMaze(MAZE_SIZE));
    setPlayerPos({ x: 1, y: 1 });
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  }, []);

  useEffect(() => {
    restartGame();
  }, [restartGame]);
  
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('lost');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);

  const handleMove = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newPos = { x: playerPos.x + dx, y: playerPos.y + dy };

    if (
      newPos.y >= 0 && newPos.y < MAZE_SIZE &&
      newPos.x >= 0 && newPos.x < MAZE_SIZE &&
      maze[newPos.y] && maze[newPos.y][newPos.x] === 0
    ) {
      setPlayerPos(newPos);
    }
  }, [playerPos, maze, gameState]);

  useEffect(() => {
    if (playerPos.y === exitPos.y && playerPos.x === exitPos.x) {
      setGameState('won');
    }
  }, [playerPos, exitPos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          handleMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          handleMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          handleMove(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-lg w-full text-center bg-card border-primary/50 p-6">
          <CardHeader>
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-4xl text-primary">You Escaped!</CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              Ghatotkacha found his way out!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={restartGame} className="font-bold">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')} className="font-bold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Card className="max-w-lg w-full text-center bg-card border-destructive/50 p-6">
          <CardHeader>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-4xl text-destructive">Time's Up!</CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              The maze was too tricky this time!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={restartGame} className="font-bold">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')} className="font-bold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (maze.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      <header className="text-center mb-4 relative w-full max-w-lg">
        <Button variant="ghost" size="icon" onClick={() => navigate('/games')} className="absolute left-0 top-1/2 -translate-y-1/2">
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl sm:text-4xl text-primary font-bold">🌀 Ghatotkacha's Maze</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Guide him to the portal!</p>
      </header>
      
      <div className="flex items-center gap-4 mb-2 font-bold text-lg">
        <div className={cn("flex items-center gap-2 p-2 rounded-md", timeLeft <= 10 && "text-destructive animate-pulse")}>
          <Clock />
          <span>{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="bg-card border border-primary/50 p-2 sm:p-4 rounded-lg shadow-2xl">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={cn(
                  'aspect-square flex items-center justify-center transition-colors duration-300 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8',
                  cell === 1 ? 'bg-stone-700' : 'bg-stone-300',
                )}
              >
                {playerPos.y === y && playerPos.x === x && <GhatotkachaIcon />}
                {y === exitPos.y && x === exitPos.x && <PortalIcon />}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 sm:hidden">
        <Button onClick={() => handleMove(0, -1)} size="icon"><ArrowUp/></Button>
        <div className="flex gap-2">
          <Button onClick={() => handleMove(-1, 0)} size="icon"><ArrowLeftIcon/></Button>
          <Button onClick={() => handleMove(0, 1)} size="icon"><ArrowDown/></Button>
          <Button onClick={() => handleMove(1, 0)} size="icon"><ArrowRightIcon/></Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Use arrow keys on desktop</p>
      </div>
      <p className="hidden sm:block text-sm text-muted-foreground mt-2">Use W/A/S/D or Arrow Keys to move</p>
    </div>
  );
};

export default MazeGame;
