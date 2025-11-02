import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load preference from localStorage
    const savedPreference = localStorage.getItem("bgMusicEnabled");
    const shouldPlay = savedPreference === "true";

    // Initialize audio element
    audioRef.current = new Audio("/back ground.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 1; // Set volume to 100%

    // Handle audio events
    const audio = audioRef.current;
    const handlePlay = () => {
      setIsPlaying(true);
      localStorage.setItem("bgMusicEnabled", "true");
    };
    const handlePause = () => {
      setIsPlaying(false);
      localStorage.setItem("bgMusicEnabled", "false");
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Try to play if user previously enabled it
    if (shouldPlay) {
      audio.play().catch(() => {
        // Autoplay blocked by browser - user needs to interact first
        setIsPlaying(false);
      });
    }

    // Cleanup
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error toggling music:", error);
      setIsPlaying(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMusic}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent shadow-sm"
      aria-label={isPlaying ? "Mute background music" : "Play background music"}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5 text-primary" />
      ) : (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  );
};

export default BackgroundMusic;

