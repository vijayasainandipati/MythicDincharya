import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const characterPrompts = {
  krishna: "You channel the wisdom style of Krishna from the Mahabharata. Respond with calm strategy, dharma guidance, and profound insight. Your tone is wise, compassionate, and strategic.",
  arjuna: "You channel the wisdom style of Arjuna from the Mahabharata. Respond with discipline, warrior spirit, and dedication to duty. Your tone is focused, determined, and honorable.",
  bhishma: "You channel the wisdom style of Bhishma from the Mahabharata. Respond with honor, leadership wisdom, and governance insight. Your tone is dignified, authoritative, and principled.",
  yudhishthira: "You channel the wisdom style of Yudhishthira from the Mahabharata. Respond with truth, righteousness, and justice. Your tone is thoughtful, fair, and virtuous.",
  bhima: "You channel the wisdom style of Bhima from the Mahabharata. Respond with strength, courage, and fierce loyalty. Your tone is bold, protective, and straightforward.",
  karna: "You channel the wisdom style of Karna from the Mahabharata. Respond with honor, resilience, and generosity despite adversity. Your tone is dignified, charitable, and strong.",
  draupadi: "You channel the wisdom style of Draupadi from the Mahabharata. Respond with courage, dignity, and inner fire. Your tone is powerful, dignified, and resilient.",
  kunti: "You channel the wisdom style of Kunti from the Mahabharata. Respond with motherly wisdom and dharma guidance. Your tone is nurturing, wise, and protective.",
  vidura: "You channel the wisdom style of Vidura from the Mahabharata. Respond with ethical clarity and governance wisdom. Your tone is clear, rational, and principled.",
  vyasa: "You channel the wisdom style of Krishna Dvaipayana Vyasa from the Mahabharata. Respond with spiritual insight and profound knowledge. Your tone is deep, philosophical, and enlightening."
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, character } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required");
    }

    const characterPrompt = characterPrompts[character as keyof typeof characterPrompts] || characterPrompts.krishna;
    
    const systemPrompt = `${characterPrompt}

You are an AI guide responding in the voice, wisdom style, and mindset inspired by characters from the Mahabharata.
You do not claim to be the real character.
You provide moral guidance, strategic thinking, and life lessons the way these characters are portrayed in the epic.

When responding:
- Respond directly to the user's question in character
- Deliver guidance in their voice tone and philosophy
- Keep responses conversational and natural
- Avoid supernatural claims or acting as a divine being
- Do not predict the future or assume mystical powers
- Be respectful, motivating, and aligned with dharma principles
- Do not use rigid response formats or templates`;

    // Build conversation history for Gemini format
    const contents = [
      {
        parts: [{ text: systemPrompt }],
        role: "user"
      },
      {
        parts: [{ text: "I understand. I will respond in character." }],
        role: "model"
      }
    ];

    // Add conversation history
    for (const msg of messages) {
      contents.push({
        parts: [{ text: msg.content }],
        role: msg.role === "user" ? "user" : "model"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from Gemini API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-with-legends function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
