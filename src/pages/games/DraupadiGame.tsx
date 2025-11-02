import { ArrowLeft, Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const riddles = [
  { id: 1, question: "Did Arjuna hesitate to fight in the Kurukshetra war despite being a warrior?", answer: "Yes" },
  { id: 2, question: "Was Draupadi born from a fire (yajna) rather than a human mother?", answer: "Yes" },
  { id: 3, question: "Did Yudhishthira lie at any point in the epic?", answer: "Yes" },
  { id: 4, question: "Did Bhima defeat Duryodhana by striking him below the waist?", answer: "Yes" },
  { id: 5, question: "Did Krishna ever pick up a weapon during the Kurukshetra war?", answer: "Yes" },
  { id: 6, question: "Did Karna know he was Kunti's son before his death?", answer: "No" },
  { id: 7, question: "Was Shakuni motivated mainly by a desire for revenge?", answer: "Yes" },
  { id: 8, question: "Did Bhishma ever fight on the Pandava side?", answer: "No" },
  { id: 9, question: "Did Drona teach both Pandavas and Kauravas martial arts?", answer: "Yes" },
  { id: 10, question: "Did Abhimanyu know how to exit the Chakravyuha formation?", answer: "No" },
  { id: 11, question: "Did Draupadi have only one husband?", answer: "No" },
  { id: 12, question: "Did Yudhishthira gamble away his kingdom?", answer: "Yes" },
  { id: 13, question: "Was Krishna ever a reigning king of Dwaraka?", answer: "Yes" },
  { id: 14, question: "Did Karna give away his divine armor (kavacha) before the war?", answer: "Yes" },
  { id: 15, question: "Was Duryodhana universally regarded as righteous?", answer: "No" },
  { id: 16, question: "Did Gandhari blindfold herself for life?", answer: "Yes" },
  { id: 17, question: "Did Ekalavya cut off his thumb as guru dakshina to Drona?", answer: "Yes" },
  { id: 18, question: "Did Bhima attack and kill Duhshasana in vengeance for Draupadi's humiliation?", answer: "Yes" },
  { id: 19, question: "Did Krishna recite the Bhagavad Gita to Yudhishthira?", answer: "No" },
  { id: 20, question: "Did the Pandavas spend 14 years in exile before returning to reclaim their kingdom?", answer: "Yes" }
];

const DraupadiGame = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (answer: string) => {
    if (riddles[currentQuestion].answer === answer) {
      setScore(score + 1);
      if (currentQuestion < riddles.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate('/games');
        }}
        className="absolute top-6 left-6 text-foreground hover:text-primary pointer-events-auto cursor-pointer z-50"
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <Card className="max-w-2xl w-full p-8 bg-card border-2 border-primary shadow-golden">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <Dice6 className="w-10 h-10" /> Draupadi's Dice Dilemma <Dice6 className="w-10 h-10" />
          </h1>
          <p className="text-foreground/80">
            Answer the riddles to guide Draupadi to freedom.
          </p>
        </div>

        {!gameOver ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl text-foreground font-semibold mb-6 text-center">
                {riddles[currentQuestion].question}
              </h2>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAnswer("Yes");
                  }}
                  className="px-12 py-6 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white pointer-events-auto cursor-pointer"
                >
                  Yes
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAnswer("No");
                  }}
                  className="px-12 py-6 text-xl font-semibold bg-red-600 hover:bg-red-700 text-white pointer-events-auto cursor-pointer"
                >
                  No
                </Button>
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              Question {currentQuestion + 1} of {riddles.length} | Score: {score}
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {score === riddles.length ? "🎉 Victory!" : "Game Over"}
            </h2>
            <p className="text-xl text-foreground mb-6">
              Final Score: {score} / {riddles.length}
            </p>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentQuestion(0);
                setScore(0);
                setGameOver(false);
              }}
              className="bg-gradient-hero text-primary-foreground font-semibold shadow-golden hover:opacity-90 pointer-events-auto cursor-pointer"
            >
              Play Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DraupadiGame;
