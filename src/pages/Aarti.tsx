import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Play, Pause } from "lucide-react";

const aartis = [
  {
    id: 1,
    title: "Krishna Aarti",
    deity: "Lord Krishna",
    lyrics: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥

जो ध्यावे फल पावे, दुःख बिनसे मन का।
सुख सम्पति घर आवे, कष्ट मिटे तन का॥

मात पिता तुम मेरे, शरण गहूँ किसकी।
तुम बिन और न दूजा, आस करूँ जिसकी॥`,
    meaning: "This aarti praises Lord Krishna as the remover of all troubles and the ultimate refuge."
  },
  {
    id: 2,
    title: "Shiva Aarti",
    deity: "Lord Shiva",
    lyrics: `ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।
ब्रह्मा विष्णु सदाशिव, अर्धांगी धारा॥

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥

दो भुज चार चतुर्भुज दसभुज अति सोहे।
तीनों रूप निरखता त्रिभुवन जन मोहे॥`,
    meaning: "This aarti celebrates Lord Shiva in his cosmic form as the destroyer and transformer."
  },
  {
    id: 3,
    title: "Hanuman Aarti",
    deity: "Lord Hanuman",
    lyrics: `आरती कीजै हनुमान लला की।
दुष्ट दलन रघुनाथ कला की॥

जाके बल से गिरिवर काँपै।
रोग दोष जाके निकट न झाँपै॥

अंजनि पुत्र महा बलदाई।
संतन के प्रभु सदा सहाई॥`,
    meaning: "This aarti honors Hanuman's immense strength and devotion to Lord Rama."
  }
];

const Aarti = () => {
  const navigate = useNavigate();
  const [selectedAarti, setSelectedAarti] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, you would integrate audio playback here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Sacred Aartis</h1>
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <p className="text-foreground/80">
            Connect with the divine through sacred hymns
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aartis.map((aarti) => (
            <Card
              key={aarti.id}
              className={`p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer ${
                selectedAarti === aarti.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedAarti(aarti.id)}
            >
              <h3 className="text-xl font-semibold text-primary mb-2">
                {aarti.title}
              </h3>
              <p className="text-muted-foreground">{aarti.deity}</p>
            </Card>
          ))}
        </div>

        {selectedAarti && (
          <Card className="p-8 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-1">
                  {aartis[selectedAarti - 1].title}
                </h2>
                <p className="text-muted-foreground">
                  {aartis[selectedAarti - 1].deity}
                </p>
              </div>
              <Button
                onClick={handlePlayPause}
                className="bg-gradient-hero text-primary-foreground font-semibold shadow-golden hover:opacity-90"
                size="lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Play Audio
                  </>
                )}
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Lyrics
              </h3>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <p className="text-foreground whitespace-pre-line font-sanskrit text-lg leading-relaxed">
                  {aartis[selectedAarti - 1].lyrics}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Meaning
              </h3>
              <p className="text-muted-foreground">
                {aartis[selectedAarti - 1].meaning}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Aarti;
