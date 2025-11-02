import { ArrowLeft, Sunrise, Droplets, Sparkles, Heart, Bath, Coffee, Utensils, Users, Flame, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { slokas } from "@/data/slokas";
import { useMemo } from "react";

const routineSteps = [
  {
    time: "5:00 AM",
    name: "Brahma Muhurta",
    icon: Sunrise,
    description: "Wake up, offer prayers, and meditate in this auspicious period.",
    benefit: "A gentle time when the world is quiet and dreams turn into courage. Waking early gives your mind clarity and makes your day feel powerful.",
    encouragement: "Rise slowly, breathe deep, and begin like a hero greeting the dawn."
  },
  {
    time: "5:30 AM",
    name: "Usha Paana",
    icon: Droplets,
    description: "Drink a glass of warm water to cleanse the system.",
    benefit: "Warm water wakes your stomach like sunlight waking a lotus. It helps your body start fresh and ready.",
    encouragement: "A small good habit is a small victory."
  },
  {
    time: "6:00 AM",
    name: "Danta Dhavana",
    icon: Sparkles,
    description: "Cleanse your senses: brush teeth and scrape your tongue.",
    benefit: "Clean breath, clean mind — tiny heroes care for their body. This simple act brings freshness to your whole day.",
    encouragement: "Every step makes you stronger and brighter."
  },
  {
    time: "6:30 AM",
    name: "Vyayama",
    icon: Heart,
    description: "Engage in physical exercise like yoga or surya namaskar.",
    benefit: "Move like Arjuna training — strong, calm, focused. Your body becomes your chariot.",
    encouragement: "Even heroes start with tiny routines."
  },
  {
    time: "7:30 AM",
    name: "Snana (Bath)",
    icon: Bath,
    description: "Take a bath to purify the body and mind.",
    benefit: "Water washes away sleepiness and worry. You emerge renewed, like a warrior ready for the day.",
    encouragement: "Dharma begins with caring for yourself and others."
  },
  {
    time: "8:30 AM",
    name: "Light Breakfast",
    icon: Coffee,
    description: "A light and nourishing meal to start your day.",
    benefit: "Fresh food fuels your dreams like fire powers a chariot. Eat with gratitude and joy.",
    encouragement: "A small good habit is a small victory."
  },
  {
    time: "12:30 PM",
    name: "Midday Meal",
    icon: Utensils,
    description: "Eat your largest meal when digestive fire is strongest.",
    benefit: "The sun is high, your body is strong. This is when food becomes energy and power.",
    encouragement: "Every step makes you stronger and brighter."
  },
  {
    time: "4:00 PM",
    name: "Service (Seva)",
    icon: Users,
    description: "Help others, practice charity or community service.",
    benefit: "Even small acts of kindness create ripples of light. Be like Karna — generous and noble.",
    encouragement: "Dharma begins with caring for yourself and others."
  },
  {
    time: "6:00 PM",
    name: "Evening Prayer",
    icon: Flame,
    description: "Evening prayer and gratitude for the day's blessings.",
    benefit: "Evening gratitude glows like a lamp in your heart. Thank the day, release your worries.",
    encouragement: "A small good habit is a small victory."
  }
];

export default function Dinacharya() {
  const navigate = useNavigate();

  // Get daily sloka based on day of year (cycles through 50 slokas)
  const dailySloka = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const slokaIndex = dayOfYear % 50;
    return slokas[slokaIndex];
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Dincharya - The Vedic Routine
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Align your day with the rhythms of nature. This schedule is a guide to a balanced life, inspired by ancient wisdom.
          </p>
        </div>

        {/* Daily Sloka Section */}
        <Card className="max-w-3xl mx-auto mb-12 p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/20">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Today's Wisdom</h2>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-serif text-foreground text-center leading-relaxed">
              {dailySloka.sloka}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <p className="text-lg text-muted-foreground text-center italic">
              {dailySloka.meaning}
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {routineSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-primary font-semibold">{step.time}</p>
                    <h3 className="font-bold text-foreground">{step.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {step.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-foreground/90 italic">
                    {step.benefit}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {step.encouragement}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
