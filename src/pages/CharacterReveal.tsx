import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const characterData = [
  { start: "01-01", end: "01-31", name: "Bhishma", traits: "Duty, Discipline, Leadership", quote: "Dharma protects those who uphold Dharma." },
  { start: "02-01", end: "02-29", name: "Krishna", traits: "Wisdom, Strategy, Compassion", quote: "Whenever Dharma declines, I appear." },
  { start: "03-01", end: "03-31", name: "Arjuna", traits: "Focus, Courage, Skill", quote: "Focus only on your goal, nothing else." },
  { start: "04-01", end: "04-30", name: "Yudhishthira", traits: "Truth, Justice, Calm", quote: "Truth is the highest virtue." },
  { start: "05-01", end: "05-31", name: "Draupadi", traits: "Strength, Dignity, Loyalty", quote: "I stand for dignity and justice." },
  { start: "06-01", end: "06-30", name: "Karna", traits: "Generosity, Loyalty, Resilience", quote: "Honor is greater than life itself." },
  { start: "07-01", end: "07-31", name: "Abhimanyu", traits: "Bravery, Youth Energy", quote: "I fight with a pure heart, without fear." },
  { start: "08-01", end: "08-31", name: "Nakula", traits: "Grace, Kindness, Purity", quote: "True beauty is inner purity." },
  { start: "09-01", end: "09-30", name: "Sahadeva", traits: "Logic, Intelligence, Humility", quote: "Knowledge without humility is useless." },
  { start: "10-01", end: "10-31", name: "Bheema", traits: "Strength, Loyalty, Protection", quote: "Strength is to protect, never to oppress." },
  { start: "11-01", end: "11-30", name: "Drona", traits: "Learning, Mastery, Mentorship", quote: "A master shapes warriors and wisdom." },
  { start: "12-01", end: "12-31", name: "Ghatotkacha", traits: "Courage, Creativity, Magic", quote: "Use your gifts to help others." }
];

const CharacterReveal = () => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [character, setCharacter] = useState<typeof characterData[0] | null>(null);

  const findCharacter = () => {
    if (!birthDate) return;
    
    const [year, month, day] = birthDate.split("-");
    const dateKey = `${month}-${day}`;
    
    const found = characterData.find(char => {
      return dateKey >= char.start && dateKey <= char.end;
    });
    
    if (found) {
      setCharacter(found);
    }
  };

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

      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-2">
          Find Your Inner Hero
        </h1>
        <p className="text-center text-foreground/80 mb-8">
          Your birth date has a cosmic connection to the heroes of the Mahabharata. Pick your date of birth to reveal your mythological twin!
        </p>

        <Card className="p-6 bg-card border-border shadow-card mb-6">
          <label className="block text-primary font-semibold mb-3">
            Enter Your Birth Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground"
              placeholder="October 18th, XXXX"
            />
          </div>
          <Button
            onClick={findCharacter}
            className="w-full mt-4 bg-gradient-hero text-primary-foreground font-semibold shadow-golden hover:opacity-90"
          >
            Reveal My Character
          </Button>
        </Card>

        {character && (
          <Card className="p-6 bg-card border-primary/50 shadow-golden animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-hero mb-4 flex items-center justify-center text-6xl shadow-golden">
                {character.name === "Krishna" ? "🦚" : 
                 character.name === "Arjuna" ? "🏹" :
                 character.name === "Draupadi" ? "👑" :
                 character.name === "Bheema" ? "💪" :
                 character.name === "Karna" ? "⚔️" : "✨"}
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">{character.name}</h2>
              <p className="text-accent font-semibold mb-4">{character.traits}</p>
              <p className="text-foreground/90 italic mb-4">"{character.quote}"</p>
              <div className="w-full h-1 bg-gradient-hero rounded-full" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CharacterReveal;
