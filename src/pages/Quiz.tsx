import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const allQuizQuestions = [
  {"id":1,"question":"In the Mahabharata, who is primarily considered the embodiment of dharma and righteousness who guides the Pandavas?","options":["Duryodhana","Krishna","Karna","Shakuni"],"answer":"Krishna"},
  {"id":2,"question":"Which epic focuses on Rama's exile and return as an ideal king?","options":["Mahabharata","Ramayana","Bhagavata Purana","Puranas"],"answer":"Ramayana"},
  {"id":3,"question":"Dharma in Sanskrit roughly means:","options":["Desire","Law, duty, righteousness","Wealth","Delusion"],"answer":"Law, duty, righteousness"},
  {"id":4,"question":"Who was the mother of the Pandavas?","options":["Kunti","Satyavati","Gandhari","Kausalya"],"answer":"Kunti"},
  {"id":5,"question":"Which character is famous for his adherence to truth even at great personal cost in the Ramayana?","options":["Ravana","Rama","Vibhishana","Bharata"],"answer":"Rama"},
  {"id":6,"question":"Who advised Yudhishthira on dharma and the conduct of kingship throughout the Mahabharata?","options":["Shakuni","Drona","Bhishma","Sanjaya"],"answer":"Bhishma"},
  {"id":7,"question":"Which brother of Rama ruled Ayodhya while Rama was in exile?","options":["Lakshmana","Shatrughna","Bharata","Sugriva"],"answer":"Bharata"},
  {"id":8,"question":"Which epic contains the Bhagavad Gita, a dialogue on duty and righteousness?","options":["Ramayana","Mahabharata","Vedas","Upanishads"],"answer":"Mahabharata"},
  {"id":9,"question":"Karna is known for which of the following virtues despite his tragic life?","options":["Steadfast generosity (dana)","Cowardice","Greed","Treachery"],"answer":"Steadfast generosity (dana)"},
  {"id":10,"question":"Who kidnapped Sita leading to the central conflict in the Ramayana?","options":["Vibhishana","Indrajit","Ravana","Subahu"],"answer":"Ravana"},
  {"id":11,"question":"Who taught Arjuna about his duty (dharma) on the battlefield of Kurukshetra?","options":["Drona","Krishna","Bhima","Yudhishthira"],"answer":"Krishna"},
  {"id":12,"question":"The principle of 'Svadharma' refers to:","options":["Universal law for all","One's own duty according to position","A ritual sacrifice","The law of karma"],"answer":"One's own duty according to position"},
  {"id":13,"question":"Which Pandava was the peerless archer and central warrior besides Arjuna?","options":["Yudhishthira","Bhima","Nakula","Sahadeva"],"answer":"Arjuna"},
  {"id":14,"question":"Who is called 'Maryada Purushottam' (the perfect man who upholds limits) in Ramayana?","options":["Rama","Lakshmana","Bharata","Hanuman"],"answer":"Rama"},
  {"id":15,"question":"Which epic explores complex moral dilemmas among kin, duty, and justice culminating in a great war?","options":["Ramayana","Mahabharata","Panchatantra","Hitopadesha"],"answer":"Mahabharata"},
  {"id":16,"question":"In the Mahabharata, who is the eldest of the Kauravas?","options":["Duryodhana","Dushasana","Shakuni","Yuyutsu"],"answer":"Duryodhana"},
  {"id":17,"question":"Which figure is the devoted monkey-general who helped Rama rescue Sita?","options":["Sugriva","Hanuman","Jatayu","Angada"],"answer":"Hanuman"},
  {"id":18,"question":"Adhering to one's moral duty even when it causes personal suffering is an example of which dharmic concept?","options":["Artha","Kama","Svadharma","Moksha"],"answer":"Svadharma"},
  {"id":19,"question":"Who was the teacher (guru) of both the Kauravas and Pandavas in martial arts?","options":["Drona","Kripa","Bhishma","Vyasa"],"answer":"Drona"},
  {"id":20,"question":"Which Pandava was famed for his strength and love of food?","options":["Arjuna","Yudhishthira","Bhima","Nakula"],"answer":"Bhima"},
  {"id":21,"question":"Which act is central to Rama's claim to kingship and dharma in the Ramayana?","options":["Exile for 14 years","Conquering Lanka alone","Killing Vali","Abdicating throne"],"answer":"Exile for 14 years"},
  {"id":22,"question":"Who is the author/traditional composer attributed to the Ramayana?","options":["Vyasa","Valmiki","Bharavi","Kalidasa"],"answer":"Valmiki"},
  {"id":23,"question":"In the Mahabharata, which character vows to avenge Draupadi's humiliation?","options":["Duryodhana","Arjuna","Bhima","Karna"],"answer":"Bhima"},
  {"id":24,"question":"Who refused to break his pledge to Gandhari and thus accepted the consequences of war?","options":["Duryodhana","Dhritarashtra","Shakuni","Yudhishthira"],"answer":"Dhritarashtra"},
  {"id":25,"question":"Which of these is a central theme of Itihasa concerning kings and rulers?","options":["Maximizing wealth","Observance of dharma in governance","Avoiding warfare entirely","Ignoring counsel"],"answer":"Observance of dharma in governance"},
  {"id":26,"question":"The dialogue of Krishna and Arjuna that explains karma yoga and dharma is called:","options":["Bhagavad Gita","Yoga Vasistha","Ramayana","Arthashastra"],"answer":"Bhagavad Gita"},
  {"id":27,"question":"Which character in Ramayana is famous for his absolute devotion to Rama and single-minded service?","options":["Vibhishana","Hanuman","Jatayu","Vali"],"answer":"Hanuman"},
  {"id":28,"question":"What does 'Rita' in Vedic thought most closely relate to, which later connects to dharma?","options":["Cosmic order and truth","Wealth accumulation","Personal desire","Ignorance"],"answer":"Cosmic order and truth"},
  {"id":29,"question":"Who was the charioteer and friend of Arjuna who revealed future events to Dhritarashtra?","options":["SanJaya","Sanjaya","Kripa","Satyaki"],"answer":"Sanjaya"},
  {"id":30,"question":"Which character is noted for strict adherence to promises and hospitality in Mahabharata?","options":["Shakuni","Yudhishthira","Duryodhana","Karna"],"answer":"Yudhishthira"},
  {"id":31,"question":"Dharma can be context-sensitive — the term for duty determined by one's stage of life and position is:","options":["Ashrama and Varna duties (svadharma)","Universal law (sarvadharma)","Random choice","Economic need"],"answer":"Ashrama and Varna duties (svadharma)"},
  {"id":32,"question":"Who was the queen of Ayodhya and mother of Rama?","options":["Kaikeyi","Sumitra","Kausalya","Mandavi"],"answer":"Kausalya"},
  {"id":33,"question":"Which Pandava is known for his wisdom, justice, and adherence to truth above all?","options":["Bhima","Arjuna","Yudhishthira","Nakula"],"answer":"Yudhishthira"},
  {"id":34,"question":"In the Ramayana, who is Rama's loyal younger brother who accompanied him into exile?","options":["Bharata","Lakshmana","Shatrughna","Sugriva"],"answer":"Lakshmana"},
  {"id":35,"question":"Who was the blind king in the Mahabharata whose attachment led to partiality for his sons?","options":["Pandu","Dhritarashtra","Vidura","Janaka"],"answer":"Dhritarashtra"},
  {"id":36,"question":"The punishment of Kaikeyi's boons to send Rama into exile raises discussions of which dharmic conflict?","options":["Duty to father vs. duty to king","Duty to mother vs. duty to brother","Personal desire vs. social duty","Religion vs. warfare"],"answer":"Duty to mother vs. duty to brother"},
  {"id":37,"question":"Which demon-king's surrender of his brother Vibhishana after the war is often discussed in dharma debates?","options":["Ravana","Vibhishana","Kumbhakarna","Indrajit"],"answer":"Vibhishana"},
  {"id":38,"question":"Karna's birth and life raise questions about dharma versus social status. Who was his biological mother?","options":["Kunti","Satyavati","Gandhari","Radha"],"answer":"Kunti"},
  {"id":39,"question":"Which weapon or boon made Ravana nearly invincible and central to his arrogance?","options":["Brahmastra","Boons from Brahma","Sudarshana Chakra","Vajra"],"answer":"Boons from Brahma"},
  {"id":40,"question":"Which concept in Itihasa highlights right action without attachment to results?","options":["Bhakti","Karma-yoga","Artha","Kama"],"answer":"Karma-yoga"},
  {"id":41,"question":"Who is the mother of Lakshmana and Shatrughna?","options":["Kausalya","Sumitra","Kaikeyi","Mandavi"],"answer":"Sumitra"},
  {"id":42,"question":"Which character in Mahabharata is famous for his even-handed counsel and moral clarity to the king?","options":["Shakuni","Vidura","Drona","Karna"],"answer":"Vidura"},
  {"id":43,"question":"Dharma often requires sacrifice. Which Pandava sacrificed to uphold righteousness even when it cost him the kingdom?","options":["Duryodhana","Yudhishthira","Arjuna","Bhima"],"answer":"Yudhishthira"},
  {"id":44,"question":"Which vanara (monkey) prince acted as a messenger and fought in Rama's army in the Ramayana?","options":["Angada","Jambavan","Hanuman","Sugriva"],"answer":"Angada"},
  {"id":45,"question":"The exile of Rama to the forest is usually interpreted in dharmic teaching as:","options":["A lapse in judgement","A test and model of ideal conduct","An irrelevant episode","A political coup"],"answer":"A test and model of ideal conduct"},
  {"id":46,"question":"Who composed the Mahabharata according to tradition?","options":["Valmiki","Vyasa","Kalidasa","Bharavi"],"answer":"Vyasa"},
  {"id":47,"question":"Which of these is a major dharmic failing shown by Duryodhana?","options":["Respecting elders","Greed and envy","Compassion for enemies","Self-sacrifice"],"answer":"Greed and envy"},
  {"id":48,"question":"Who is the mother of the Kauravas?","options":["Satyavati","Gandhari","Kunti","Ambika"],"answer":"Gandhari"},
  {"id":49,"question":"Which idea from Itihasa emphasizes the role of righteous conduct in public life?","options":["Maya","Dharma","Lila","Tapasya"],"answer":"Dharma"},
  {"id":50,"question":"Which of the following is considered essential for a king following dharma in Itihasa?","options":["Tyranny","Justice and welfare of subjects","Personal accumulation of power","Isolation"],"answer":"Justice and welfare of subjects"}
];

// Shuffle and select 10 random questions for each quiz session
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const quizQuestions = shuffleArray(allQuizQuestions).slice(0, 10);

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get today's question based on day of year
  const todayQuestion = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const questionIndex = dayOfYear % allQuizQuestions.length;
    return allQuizQuestions[questionIndex];
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch user profile and dharma points
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);

      // Check if user already answered today
      const today = new Date().toISOString().split("T")[0];
      const { data: answerData } = await supabase
        .from("daily_quiz_answers")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("question_date", today)
        .maybeSingle();

      if (answerData) {
        setAlreadyAnswered(true);
        setIsCorrect(answerData.is_correct);
        setSelectedAnswer(answerData.is_correct ? todayQuestion.answer : "answered");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (alreadyAnswered || !user) return;

    setSelectedAnswer(answer);
    const correct = answer === todayQuestion.answer;
    setIsCorrect(correct);

    try {
      const today = new Date().toISOString().split("T")[0];
      
      // Save the answer
      const { error } = await supabase
        .from("daily_quiz_answers")
        .insert({
          user_id: user.id,
          question_date: today,
          is_correct: correct,
        });

      if (error) throw error;

      // Refresh profile to show updated dharma points
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(updatedProfile);
      setAlreadyAnswered(true);

      toast({
        title: correct ? "🕉️ Correct!" : "Not quite",
        description: correct
          ? "You earned 1 Dharma Point! You walked the path of Dharma today."
          : "Reflect and return tomorrow for another chance.",
      });
    } catch (error: any) {
      console.error("Error saving answer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your answer. Please try again.",
      });
      setSelectedAnswer(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Daily Dharma Quiz</h1>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-foreground/80">
            One question per day to test your dharma wisdom
          </p>
        </div>

        {/* User Stats */}
        {profile && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="text-xl font-bold text-foreground">
                  {profile.full_name || profile.email}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-5 w-5 text-primary" />
                    <p className="text-3xl font-bold text-primary">
                      {profile.dharma_points || 0}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Dharma Points</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Daily Question */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Today's Question
                </span>
              </div>
              {alreadyAnswered && (
                <span className="text-sm text-muted-foreground">
                  {isCorrect ? "✓ Answered Correctly" : "Answered"}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              {todayQuestion.question}
            </h2>
          </div>

          {alreadyAnswered ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {todayQuestion.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      option === todayQuestion.answer
                        ? "bg-green-600/20 border-green-600"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{option}</span>
                      {option === todayQuestion.answer && (
                        <span className="text-green-600 font-semibold">✓ Correct Answer</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-4 border-t border-border">
                <p className="text-lg text-primary font-semibold mb-2">
                  {isCorrect
                    ? "🕉️ Well done! You earned 1 Dharma Point!"
                    : "Return tomorrow for another question!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  A new question will be available tomorrow
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {todayQuestion.options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left justify-start h-auto ${
                    selectedAnswer === option
                      ? option === todayQuestion.answer
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-red-600 hover:bg-red-600"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  variant="outline"
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
