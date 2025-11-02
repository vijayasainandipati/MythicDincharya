import { useState, useCallback, useEffect } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { ArrowLeft, RefreshCw, Undo2, Volume2, VolumeX, Trophy, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const characterMap = {
  white: {
    k: { name: 'Yudhishthira', role: 'King', quote: 'Truth is the highest virtue' },
    q: { name: 'Krishna', role: 'Queen', quote: 'Whenever Dharma declines, I appear' },
    r: { name: 'Bhima', role: 'Rook', quote: 'Strength protects the righteous' },
    b: { name: 'Arjuna', role: 'Bishop', quote: 'Focus only on your goal' },
    n: { name: 'Nakula', role: 'Knight', quote: 'Grace guides my path' },
    p: { name: 'Pandava Soldier', role: 'Pawn', quote: 'For Dharma, we march!' },
  },
  black: {
    k: { name: 'Duryodhana', role: 'King', quote: 'Power is my birthright' },
    q: { name: 'Shakuni', role: 'Queen', quote: 'Strategy conquers all' },
    r: { name: 'Kumbhakarna', role: 'Rook', quote: 'None shall pass!' },
    b: { name: 'Shalya', role: 'Bishop', quote: 'Precision in battle' },
    n: { name: 'Ashwatthama', role: 'Knight', quote: 'Swift as lightning' },
    p: { name: 'Kuru Soldier', role: 'Pawn', quote: 'For the throne!' },
  },
};

const pieceIcons = {
  k: '♔',
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙',
};

type BattleLog = {
  move: string;
  character: string;
  quote: string;
  isCapture: boolean;
};

const ChessGame = () => {
  const navigate = useNavigate();
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLog[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeP1fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+lunywmweBzaM0vPVizUHH2+/7+GXTRAKUKXi8bllHAU5kdXzzn0pBSd7x/DajT4JE16z6OmqVhMJRp/g8r9uIQc5j9Xz1YU0Bx5uwO/hmUgODlWs5++wXRgIPJXp8sJsHgc2jNHz1Yk1Bx5vv+/hmEwPClCl4vG5ZRsFOZDU8899KQUme8fw2o0+CRNetujpq1YTCESf4fK/bSAHOY/V89SFNAcdbrDv4plIDg5VrOfvsF0YCDyV6fLCbB4HNozR89WJNQcfb7/v45hMDwpPpeLxuWUbBTmQ1PPPfSkFJnvH8NqNPgkTXrbo6atWEwhEn+HyvmwhBzmP1fPUhTQHHm6w7+KZRw4OVqzn77BdGAg8lenyv2weBjaM0fPVijUHHm+/7+OYTA8KT6Xj8bllGwU5kdTzz30pBSZ7x+/ajT4JE16z6OmqVhIIRJ/h8r5sIQc5jtXz1IU0Bx5vv+/hmUcODlas5++wXRgIPJXo8r9sHgY3jNHz1Yo1Bx5vv+/jmEwPCk+l4/G5ZRsFOZDU8899KQUme8fv2o0+CRNes+jpqlYSCESf4fK+bCAHOY7V89SFNAceb7/v4JlHDg5WrOfvsF0YCDyV6PK/bB4GNozQ89WJNQYfb7/v45hMDwpPpePxuWUbBTmQ1PPPfSkFJnvH79qNPwkTXrPo6atWEgc=');
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const getCharacterInfo = useCallback((piece: { type: PieceSymbol; color: 'w' | 'b' }) => {
    const color = piece.color === 'w' ? 'white' : 'black';
    return characterMap[color][piece.type];
  }, []);

  const updatePosition = useCallback(() => {
    setPosition(game.board());
    if (game.isCheckmate()) {
      setGameOver(true);
      setWinner(game.turn() === 'w' ? 'black' : 'white');
      toast({
        title: game.turn() === 'w' ? '⚔️ Kauravas Conquer!' : '🏆 Pandavas Triumph!',
        description: 'Victory is yours!',
      });
    } else if (game.isDraw()) {
      setGameOver(true);
      setWinner('draw');
      toast({ title: '🤝 Stalemate', description: 'The battle ends in a draw' });
    } else if (game.inCheck()) {
      toast({ title: '⚠️ Check!', description: 'The King is in danger!', variant: 'destructive' });
    }
  }, [game]);

  const handleSquareClick = useCallback((square: Square, piece: any) => {
    if (gameOver) return;

    // If no square selected and there's a piece of current turn
    if (!selectedSquare) {
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Try to make a move
    try {
      const move = game.move({
        from: selectedSquare,
        to: square,
        promotion: 'q',
      });

      if (move) {
        playSound();
        setLastMove({ from: selectedSquare, to: square });
        
        const capturedPiece = move.captured;
        const movingPiece = move.piece;
        const charInfo = getCharacterInfo({ type: movingPiece, color: move.color });
        
        const logEntry: BattleLog = {
          move: `${move.from}→${move.to}`,
          character: charInfo.name,
          quote: charInfo.quote,
          isCapture: !!capturedPiece,
        };
        
        setBattleLog(prev => [logEntry, ...prev.slice(0, 9)]);
        setMoveHistory(prev => [...prev, move.san]);
        
        updatePosition();
      }
    } catch (e) {
      // Invalid move, try selecting new piece
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map(m => m.to));
        return;
      }
    }

    setSelectedSquare(null);
    setLegalMoves([]);
  }, [game, gameOver, selectedSquare, playSound, getCharacterInfo, updatePosition]);

  const handleRestart = useCallback(() => {
    game.reset();
    updatePosition();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setBattleLog([]);
    setGameOver(false);
    setWinner(null);
    setMoveHistory([]);
  }, [game, updatePosition]);

  const handleUndo = useCallback(() => {
    game.undo();
    updatePosition();
    setSelectedSquare(null);
    setLegalMoves([]);
    setBattleLog(prev => prev.slice(1));
    setMoveHistory(prev => prev.slice(0, -1));
    if (gameOver) {
      setGameOver(false);
      setWinner(null);
    }
  }, [game, gameOver, updatePosition]);

  const getSquareColor = (row: number, col: number) => {
    return (row + col) % 2 === 0 ? 'bg-[#EFDBB2]' : 'bg-[#B58863]';
  };

  const getSquareLabel = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}` as Square;
  };

  if (gameOver && winner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
        <Card className="w-full max-w-md text-center border-primary/50 bg-card/95 backdrop-blur">
          <CardHeader>
            {winner === 'draw' ? (
              <Swords className="w-20 h-20 mx-auto mb-4 text-muted-foreground animate-pulse" />
            ) : (
              <Trophy className="w-20 h-20 mx-auto mb-4 text-primary animate-bounce" />
            )}
            <CardTitle className="text-4xl font-bold">
              {winner === 'white' && '🏆 Pandavas Triumph!'}
              {winner === 'black' && '⚔️ Kauravas Conquer!'}
              {winner === 'draw' && '🤝 Honorable Draw'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground">
              {winner === 'draw'
                ? 'Neither side could claim victory'
                : `Victory belongs to the ${winner === 'white' ? 'Pandavas' : 'Kauravas'}!`}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRestart} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Battle
              </Button>
              <Button variant="outline" onClick={() => navigate('/games')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/games')}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary">⚔️ Mahabharata Chess</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={moveHistory.length === 0}>
              <Undo2 />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RefreshCw />
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-4">
          {/* Main Board */}
          <div className="flex flex-col items-center">
            <Card className="mb-3 w-full max-w-[600px] bg-card/80 backdrop-blur border-primary/30">
              <CardContent className="p-3 text-center">
                <p className="text-lg font-semibold">
                  {game.turn() === 'w' ? '🏹 Pandavas Turn' : '⚔️ Kauravas Turn'}
                </p>
              </CardContent>
            </Card>

            <div className="relative w-full max-w-[600px] aspect-square border-[6px] border-[#8B4513] rounded-sm overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {position.map((row, rowIndex) => (
                <div key={rowIndex} className="flex" style={{ height: '12.5%' }}>
                  {row.map((piece, colIndex) => {
                    const square = getSquareLabel(rowIndex, colIndex);
                    const isSelected = selectedSquare === square;
                    const isLegalMove = legalMoves.includes(square);
                    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);

                    return (
                      <button
                        key={colIndex}
                        onClick={() => handleSquareClick(square, piece)}
                        className={cn(
                          'relative flex items-center justify-center text-4xl sm:text-5xl transition-all',
                          getSquareColor(rowIndex, colIndex),
                          isSelected && 'ring-4 ring-yellow-500 ring-inset shadow-[inset_0_0_20px_rgba(234,179,8,0.6)]',
                          isLastMove && 'shadow-[inset_0_0_12px_rgba(234,179,8,0.5)]',
                          !gameOver && 'hover:brightness-105 cursor-pointer active:brightness-95',
                          'group'
                        )}
                        style={{ width: '12.5%' }}
                      >
                        {isLegalMove && (
                          <div className={cn(
                            "absolute inset-0 flex items-center justify-center",
                            piece ? "opacity-0 group-hover:opacity-100" : ""
                          )}>
                            <div className={cn(
                              "rounded-full bg-primary/40",
                              piece ? "w-full h-full" : "w-3 h-3"
                            )} />
                          </div>
                        )}
                        {piece && (
                          <span 
                            className={cn(
                              "relative z-10 transition-transform duration-200",
                              piece.color === 'w' 
                                ? 'text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.8),0_0_4px_rgba(255,255,255,0.3)]' 
                                : 'text-[#1a1a1a] [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)]',
                              isSelected && 'scale-110 brightness-125'
                            )}
                            title={getCharacterInfo(piece).name}
                          >
                            {pieceIcons[piece.type]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <Card className="mt-4 w-full max-w-[600px] bg-card/80 backdrop-blur border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Character Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-primary mb-2">White (Pandavas)</h4>
                    <ul className="space-y-1">
                      {Object.entries(characterMap.white).map(([piece, info]) => (
                        <li key={piece}>{pieceIcons[piece as PieceSymbol]} {info.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-destructive mb-2">Black (Kauravas)</h4>
                    <ul className="space-y-1">
                      {Object.entries(characterMap.black).map(([piece, info]) => (
                        <li key={piece}>{pieceIcons[piece as PieceSymbol]} {info.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Battle Log */}
          <Card className="bg-card/80 backdrop-blur border-primary/30 max-h-[700px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="w-5 h-5" />
                Battle Log
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto max-h-[600px]">
              {battleLog.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">The battle begins...</p>
              ) : (
                battleLog.map((log, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border-l-4 animate-fade-in",
                      log.isCapture ? 'border-destructive bg-destructive/10' : 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {log.isCapture && <span className="text-xl">⚔️</span>}
                      <span className="font-bold">{log.character}</span>
                      <span className="text-xs text-muted-foreground">{log.move}</span>
                    </div>
                    <p className="text-sm italic text-muted-foreground">"{log.quote}"</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
