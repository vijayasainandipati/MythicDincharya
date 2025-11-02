import { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const characters = [
  { id: "krishna", name: "Krishna", subtitle: "Wise, Divine, Strategist", avatar: "K", emoji: "🦚" },
  { id: "arjuna", name: "Arjuna", subtitle: "Disciplined Warrior", avatar: "A", emoji: "🏹" },
  { id: "bhishma", name: "Bhishma", subtitle: "Honor, Vows, Leadership", avatar: "B", emoji: "⚔️" },
  { id: "yudhishthira", name: "Yudhishthira", subtitle: "Truth, Righteousness", avatar: "Y", emoji: "👑" },
  { id: "bhima", name: "Bhima", subtitle: "Strength, Courage", avatar: "Bh", emoji: "💪" },
  { id: "karna", name: "Karna", subtitle: "Charity, Sacrifice, Honor", avatar: "Ka", emoji: "🌟" },
  { id: "draupadi", name: "Draupadi", subtitle: "Courage, Dignity", avatar: "D", emoji: "🔥" },
  { id: "kunti", name: "Kunti", subtitle: "Motherly Wisdom", avatar: "Ku", emoji: "🪷" },
  { id: "vidura", name: "Vidura", subtitle: "Ethics, Clarity", avatar: "V", emoji: "📜" },
  { id: "vyasa", name: "Vyasa", subtitle: "Spiritual Insight", avatar: "Vy", emoji: "📿" }
];

export default function ChatWithLegends() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState("krishna");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Send full conversation history including new message
      const conversationHistory = [...messages, { role: "user" as const, content: userMessage }];
      
      const { data, error } = await supabase.functions.invoke("chat-with-legends", {
        body: { 
          messages: conversationHistory,
          character: selectedCharacter 
        }
      });

      if (error) throw error;

      if (data?.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get response. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">
            Chat with Legends
          </h1>
          <p className="text-muted-foreground">
            Ask questions to the heroes of the Mahabharata.
          </p>
        </div>

        <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12 bg-primary/20 text-primary text-2xl">
              <AvatarFallback>{currentCharacter.emoji}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{currentCharacter.name}</h3>
              <p className="text-sm text-muted-foreground">{currentCharacter.subtitle}</p>
            </div>
            <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {characters.map(char => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">Ask for guidance from {currentCharacter.name}</p>
              <p className="text-sm">Example: "Advise me like {currentCharacter.name} on staying focused"</p>
            </div>
          )}

          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                    <AvatarFallback className="text-base">{currentCharacter.emoji}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                  <AvatarFallback className="text-base">{currentCharacter.emoji}</AvatarFallback>
                </Avatar>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={`Ask ${currentCharacter.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
