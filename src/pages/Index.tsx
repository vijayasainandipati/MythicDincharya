import { BookOpen, Sparkles, Gamepad2, User, LogOut, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Mythic Dincharya</h1>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <p className="text-foreground/80">Your journey through Vedic wisdom begins</p>
        
        <div className="flex gap-3 justify-center mt-4">
          {user ? (
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Welcome,</p>
                  <p className="font-bold text-foreground">
                    {profile?.full_name || user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {profile?.dharma_points || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">Dharma Points</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-hero text-primary-foreground font-semibold shadow-golden hover:opacity-90"
                onClick={() => navigate("/auth")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Sloka of the Day */}
        <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all shadow-card">
          <div className="flex items-start gap-4">
            <BookOpen className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary mb-2">📖 Sloka of the Day</h2>
              <p className="text-sm text-muted-foreground italic mb-2">
                यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।
              </p>
              <p className="text-foreground/90">
                "Whenever there is a decline in righteousness, O Bharata..."
              </p>
            </div>
          </div>
        </Card>

        {/* Daily Dharma Quiz */}
        <Card 
          className="p-6 bg-card border-border hover:border-primary/50 transition-all shadow-card cursor-pointer"
          onClick={() => navigate("/quiz")}
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary mb-2">🎯 Daily Dharma Quiz</h2>
              <p className="text-foreground/80 mb-2">
                Answer today's question to earn Dharma Points!
              </p>
              <Button 
                className="w-full bg-gradient-hero text-primary-foreground font-semibold shadow-golden hover:opacity-90"
              >
                Start Daily Quiz
              </Button>
            </div>
          </div>
        </Card>

        {/* Explore More Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary text-center">Explore More</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:border-primary/50 hover:bg-secondary"
              onClick={() => navigate('/character-reveal')}
            >
              <User className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold text-foreground">Find Hero</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:border-primary/50 hover:bg-secondary"
              onClick={() => navigate('/aarti')}
            >
              <BookOpen className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold text-foreground">Find Aarti</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:border-primary/50 hover:bg-secondary"
              onClick={() => navigate('/quiz')}
            >
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold text-foreground">Dharma Quiz</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-primary hover:border-primary hover:bg-primary/10"
              onClick={() => navigate('/games')}
            >
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-lg font-semibold text-primary">🎮 I feel like Legends</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:border-primary/50 hover:bg-secondary"
              onClick={() => navigate('/dinacharya')}
            >
              <Sparkles className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold text-foreground">Vedic Routine</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-border hover:border-primary/50 hover:bg-secondary"
              onClick={() => navigate('/chat-with-legends')}
            >
              <User className="w-8 h-8 text-accent" />
              <span className="text-lg font-semibold text-foreground">Chat with Legends</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
