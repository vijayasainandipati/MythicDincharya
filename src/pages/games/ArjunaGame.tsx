import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Heart, RefreshCw, Trophy } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

type Arrow = { x: number; y: number; vy: number };
type HitEffect = { x: number; y: number; alpha: number };

const GAME_DURATION = 60;

const ArjunaGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [eyeHits, setEyeHits] = useState(0);

  const angleRef = useRef(0);
  const fishSpeedRef = useRef(2);
  const arrowRef = useRef<Arrow | null>(null);
  const rippleOffsetRef = useRef(0);
  const fishHitRef = useRef(false);
  const hitEffectRef = useRef<HitEffect | null>(null);
  
  const fishDetails = {
    orbitX: 250,
    orbitY: 100,
    radius: 120,
    bodyWidth: 40,
    bodyHeight: 20,
    eyeOffsetX: 25,
    eyeOffsetY: -2,
    eyeRadius: 4,
  };

  useEffect(() => {
    if (gameOver || victory) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setGameOver(true);
          return 0;
        }
        if (newTime > 0 && newTime % 15 === 0 && fishSpeedRef.current < 6) {
          fishSpeedRef.current += 1;
          toast({ title: "⚡ Faster!", description: "The fish is speeding up!" });
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameOver, victory]);

  const checkCollision = useCallback((arrowPos: {x: number, y: number}) => {
    const { orbitX, orbitY, radius, eyeOffsetX, eyeOffsetY, eyeRadius } = fishDetails;
    const fishAngleRad = (angleRef.current * Math.PI) / 180;
    const fishX = orbitX + radius * Math.cos(fishAngleRad);
    const fishY = orbitY + radius * Math.sin(fishAngleRad);
    
    const eyeWorldX = fishX + eyeOffsetX * Math.cos(fishAngleRad) - eyeOffsetY * Math.sin(fishAngleRad);
    const eyeWorldY = fishY + eyeOffsetX * Math.sin(fishAngleRad) + eyeOffsetY * Math.cos(fishAngleRad);

    const distanceToEye = Math.sqrt(Math.pow(arrowPos.x - eyeWorldX, 2) + Math.pow(arrowPos.y - eyeWorldY, 2));
    
    if (distanceToEye < eyeRadius + 10) {
      toast({ title: "🏆 Bullseye!", description: "Perfect shot! +10 points" });
      setScore(prev => prev + 10);
      setEyeHits(prev => prev + 1);

      fishHitRef.current = true;
      hitEffectRef.current = { x: eyeWorldX, y: eyeWorldY, alpha: 1.0 };
      setTimeout(() => { fishHitRef.current = false; }, 1000);
      
      return true;
    }
    return false;
  }, []);

  const drawFish = (ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number, isReflection: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    
    if (isReflection) {
      ctx.scale(1, 0.5);
    } else {
      ctx.rotate(rotation);
    }
    
    let bodyFill = isReflection ? "rgba(255, 165, 0, 0.4)" : "#FFA500";
    if (fishHitRef.current && !isReflection) {
      bodyFill = `rgba(255, 0, 0, ${Math.sin(performance.now() / 100) * 0.5 + 0.5})`;
    }

    ctx.fillStyle = bodyFill;
    ctx.strokeStyle = isReflection ? "rgba(255, 215, 0, 0.4)" : "#FFD700";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.ellipse(0, 0, fishDetails.bodyWidth, fishDetails.bodyHeight, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-fishDetails.bodyWidth, 0);
    ctx.lineTo(-fishDetails.bodyWidth-15, -10);
    ctx.lineTo(-fishDetails.bodyWidth-15, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isReflection ? "rgba(255, 0, 0, 0.4)" : "red";
    ctx.beginPath();
    ctx.arc(fishDetails.eyeOffsetX, fishDetails.eyeOffsetY, fishDetails.eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!fishHitRef.current) {
      angleRef.current = (angleRef.current + fishSpeedRef.current) % 360; 
    }
    rippleOffsetRef.current += 0.05;

    if (arrowRef.current) {
      const prev = arrowRef.current;
      const newY = prev.y - prev.vy;
      const newArrowState = { ...prev, y: newY };
      
      if (checkCollision({ x: newArrowState.x, y: newArrowState.y })) {
        arrowRef.current = null;
      } else if (newArrowState.y < 0) {
        toast({ title: "❌ Missed!", description: "Lost a life", variant: "destructive" });
        setLives(prev => Math.max(0, prev - 1));
        arrowRef.current = null;
      } else {
        arrowRef.current = newArrowState;
      }
    }
    
    if (hitEffectRef.current) {
      hitEffectRef.current.alpha -= 0.05;
      if (hitEffectRef.current.alpha <= 0) {
        hitEffectRef.current = null;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 420, 180, 70, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - i/5)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        420,
        180 - i * 20 + Math.sin(rippleOffsetRef.current + i) * 3,
        70 - i * 8 + Math.cos(rippleOffsetRef.current + i) * 2,
        0, 0, 2 * Math.PI
      );
      ctx.stroke();
    }
    
    const { orbitX, orbitY, radius } = fishDetails;
    const fishAngleRad = (angleRef.current * Math.PI) / 180;
    const fishX = orbitX + radius * Math.cos(fishAngleRad);
    const fishY = orbitY + radius * Math.sin(fishAngleRad);

    drawFish(ctx, fishX, fishY, fishAngleRad, false);
    const reflectionX = fishX;
    const reflectionY = 420 + (fishY - 250) * 0.1;
    drawFish(ctx, reflectionX, reflectionY, fishAngleRad, true);
    
    if (arrowRef.current) {
      const arrow = arrowRef.current;
      ctx.fillStyle = "#8B4513";
      ctx.save();
      ctx.translate(arrow.x, arrow.y);
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(5, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    
    if (hitEffectRef.current) {
      const effect = hitEffectRef.current;
      ctx.fillStyle = `rgba(255, 255, 0, ${effect.alpha})`;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 20 * (1.0 - effect.alpha), 0, Math.PI * 2);
      ctx.fill();
    }

    if (!gameOver && !victory) {
      window.requestAnimationFrame(gameLoop);
    }
  }, [checkCollision, gameOver, victory]);

  useEffect(() => {
    if (!gameOver && !victory) {
      const animationFrameId = window.requestAnimationFrame(gameLoop);
      return () => window.cancelAnimationFrame(animationFrameId);
    }
  }, [gameOver, gameLoop, victory]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
    if (eyeHits >= 3) {
      setVictory(true);
    }
  }, [lives, eyeHits]);
  
  const handleShoot = () => {
    if (arrowRef.current || gameOver || victory) return;
    arrowRef.current = { x: 250, y: 350, vy: 10 };
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(GAME_DURATION);
    fishSpeedRef.current = 2;
    arrowRef.current = null;
    setEyeHits(0);
    setGameOver(false);
    setVictory(false);
  };
  
  if (victory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/20 to-background p-4 text-center">
        <Trophy className="h-24 w-24 text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-primary">Victory!</h1>
        <p className="text-2xl text-foreground/90 mb-4">You hit the eye 3 times! Final Score: {score}</p>
        <p className="text-muted-foreground mb-6 max-w-md">
          "Like Arjuna, you focused only on your goal. Well done, young archer!" 🏹
        </p>
        <div className="flex gap-4">
          <Button onClick={handleRestart} className="font-bold text-lg px-8">
            <RefreshCw className="mr-2"/> Play Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/games')} className="font-bold text-lg px-8">
            <ArrowLeft className="mr-2"/> Back to Games
          </Button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <h1 className="text-4xl font-bold mb-2 text-primary">Game Over</h1>
        <p className="text-2xl text-foreground/90 mb-6">Final Score: {score}</p>
        <div className="flex gap-4">
          <Button onClick={handleRestart} className="font-bold text-lg px-8">
            <RefreshCw className="mr-2"/> Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/games')} className="font-bold text-lg px-8">
            <ArrowLeft className="mr-2"/> Back to Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <Button variant="ghost" size="icon" onClick={() => navigate('/games')} className="absolute left-4 top-4">
        <ArrowLeft />
      </Button>
      <h1 className="text-4xl font-bold mb-2 text-primary">🏹 Arjuna's Eye Challenge</h1>
      <p className="text-muted-foreground mb-4 max-w-md">Look at the reflection in the water and tap to shoot!</p>
      
      <div className="flex justify-between w-full max-w-lg mb-2 text-foreground font-bold text-lg">
        <div className="flex items-center gap-2">
          <Heart className="text-destructive"/> <span>{lives}</span>
        </div>
        <p>Score: {score}</p>
        <p>Eyes: {eyeHits}/3</p>
        <div className="flex items-center gap-2">
          <Clock className="text-accent"/> <span>{timeLeft}s</span>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        className="border-4 border-primary/50 rounded-lg shadow-2xl bg-card cursor-pointer"
        onClick={handleShoot}
      />
      
      <div className="mt-4 font-bold text-lg px-8 py-4 bg-primary/10 text-primary rounded-lg">
        Speed: {fishSpeedRef.current}x
      </div>
    </div>
  );
}

export default ArjunaGame;
