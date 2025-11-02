import { ArrowLeft, Crosshair, Dice6, NavigationIcon, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: "arjuna",
    title: "Arjuna's Eye Challenge",
    icon: Crosshair,
    description: "Hit the fish's eye based on its reflection!",
    color: "success",
  },
  {
    id: "draupadi",
    title: "Draupadi's Dice Dilemma",
    icon: Dice6,
    description: "Answer yes/no riddles to escape.",
    color: "primary",
  },
  {
    id: "maze",
    title: "Ghatotkacha's Maze",
    icon: NavigationIcon,
    description: "Navigate out of the tricky cave!",
    color: "accent",
  },
  {
    id: "chess",
    title: "Mahabharata Chess",
    icon: Crown,
    description: "Play classic chess with epic characters.",
    color: "success",
  },
];

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/')}
        className="mb-6 text-foreground hover:text-primary"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-primary mb-4">
          Mythic Game Zone
        </h1>
        
        <div className="max-w-3xl mx-auto mb-12 text-center space-y-4">
          <p className="text-lg text-foreground leading-relaxed">
            Welcome, young seeker of wisdom and joy! ✨
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Here, every game is a doorway to a hero's quality — Arjuna's focus, Krishna's calm mind, 
            Draupadi's clever thinking, and Ghatotkacha's courage of heart.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Play, explore, learn, and shine — not to defeat others, but to discover the strength already inside you.
          </p>
          <p className="text-primary font-semibold text-lg mt-6">
            Your adventure begins now — ready to become your best self? 🎮
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            const borderColor = game.color === "primary" ? "border-primary" : 
                               game.color === "success" ? "border-success" : 
                               "border-accent";
            const buttonBg = game.color === "primary" ? "bg-gradient-hero text-primary-foreground" :
                            game.color === "success" ? "bg-success text-success-foreground" :
                            "bg-gradient-hero text-primary-foreground";
            
            return (
              <Card
                key={game.id}
                className={`p-8 bg-card border-2 ${borderColor} hover:shadow-golden transition-all cursor-pointer group`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Icon className={`w-16 h-16 ${game.color === "primary" ? "text-primary" : game.color === "success" ? "text-success" : "text-accent"}`} />
                  <h2 className={`text-2xl font-bold ${game.color === "primary" ? "text-primary" : game.color === "success" ? "text-success" : "text-accent"}`}>
                    {game.title}
                  </h2>
                  <p className="text-foreground/80">
                    {game.description}
                  </p>
                  <Button
                    className={`w-full font-semibold shadow-lg hover:opacity-90 ${buttonBg}`}
                    onClick={() => navigate(`/games/${game.id}`)}
                  >
                    Play
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;
