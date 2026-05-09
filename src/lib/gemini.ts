import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

import { ComputedMetrics } from "./metrics"

/**
 * Generates a cinematic music personality profile using Gemini 1.5 Flash.
 */
export async function generateMusicProfile(metrics: ComputedMetrics, userName: string) {
  const prompt = `
    You are an expert music critic and data psychologist.
    Analyze the following music metrics for a user named ${userName}:
    
    Metrics: ${JSON.stringify(metrics)}
    
    Based on this data, generate a deeply creative, cinematic, and accurate "Music Personality Profile."
    
    RULES:
    1. Be specific. Use the data (genres, niche artists, mainstream score) as evidence.
    2. The "Archetype" should be a creative title (e.g., "The Avant-Garde Archivist" or "The Mainstream Minimalist").
    3. The "Roast" should be witty but funny, not mean.
    4. Return ONLY a valid JSON object.
    
    JSON SCHEMA:
    {
      "archetype": {
        "title": "Creative Title",
        "tagline": "Short punchy summary",
        "description": "2-3 sentences explaining their vibe based on the metrics"
      },
      "aura": "A color name representing their vibe (e.g., 'Electric Violet' or 'Vintage Sepia')",
      "dna_traits": [
        { "label": "Trait Name", "value": "Percentage 0-100", "evidence": "Why they got this score" }
      ],
      "roast": "A clever 2-sentence roast of their taste",
      "praise": "A sincere 2-sentence compliment",
      "captions": ["3 short, viral-style captions for sharing"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse the JSON output
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate personality profile");
  }
}

/**
 * Analyzes the compatibility between two users based on their music metrics.
 */
export async function analyzeCompatibility(
  metricsA: ComputedMetrics,
  metricsB: ComputedMetrics,
  nameA: string,
  nameB: string
) {
  const prompt = `
    Analyze the musical compatibility between ${nameA} and ${nameB}.
    
    ${nameA}'s Metrics: ${JSON.stringify(metricsA)}
    ${nameB}'s Metrics: ${JSON.stringify(metricsB)}
    
    Write a 3-sentence "Vibe Check" analysis. 
    Be funny, slightly judgmental, and mention specific genres or popularity gaps.
    
    Return ONLY a JSON object:
    {
      "vibeCheck": "The 3-sentence analysis",
      "verdict": "A one-word verdict (e.g., 'Soulmates', 'Chaos', 'Tolerable')",
      "sharedObsession": "A genre or artist they both might actually like together"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Compatibility Error:", error);
    return { vibeCheck: "Your tastes are too complex for our AI to comprehend right now.", verdict: "Enigmatic", sharedObsession: "Silence" };
  }
}
