import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CharacterReveal from "./pages/CharacterReveal";
import Games from "./pages/Games";
import Quiz from "./pages/Quiz";
import Aarti from "./pages/Aarti";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ArjunaGame from "./pages/games/ArjunaGame";
import DraupadiGame from "./pages/games/DraupadiGame";
import MazeGame from "./pages/games/MazeGame";
import ChessGame from "./pages/games/ChessGame";
import Dinacharya from "./pages/Dinacharya";
import ChatWithLegends from "./pages/ChatWithLegends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/character-reveal" element={<CharacterReveal />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/aarti" element={<Aarti />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/arjuna" element={<ArjunaGame />} />
            <Route path="/games/draupadi" element={<DraupadiGame />} />
            <Route path="/games/maze" element={<MazeGame />} />
            <Route path="/games/chess" element={<ChessGame />} />
            <Route path="/dinacharya" element={<Dinacharya />} />
            <Route path="/chat-with-legends" element={<ChatWithLegends />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
