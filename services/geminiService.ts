
import { GoogleGenAI } from "@google/genai";
import { Task, Client } from '../types';

// Initialize Gemini Client
// In a real app, strict error handling for missing key would be needed.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaskPrioritization = async (tasks: Task[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI services unavailable (Missing API Key)";

  try {
    const prompt = `
      Analyze these recruitment tasks and provide a short summary of which 3 are most critical and why.
      Tasks: ${JSON.stringify(tasks)}
      Format: "Top Priorities: 1. [Task] - [Reason], 2. [Task] - [Reason]..."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to prioritize tasks via AI.";
  }
};

export const generateClientMessage = async (client: Client, type: 'check-in' | 'update'): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI services unavailable (Missing API Key)";

  try {
    const prompt = `
      Write a professional ${type} email for a recruitment client.
      Client Name: ${client.name}
      Industry: ${client.industry}
      Last Contact: ${client.lastContact}
      Health Score: ${client.healthScore}
      
      Tone: Professional but friendly.
      Length: Short (under 100 words).
      Goal: Re-engage if dormant, or update if active.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate message.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate message via AI.";
  }
};

export const analyzeJobDescription = async (jdText: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI services unavailable";

  try {
    const prompt = `
            Analyze the following Job Description and extract key details.
            JD: ${jdText}

            Output structured summary with:
            1. Key Skills Required (Technical & Soft)
            2. Seniority Level
            3. Ideal Candidate Persona (2 sentences)
            4. 3 Potential Interview Questions
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not analyze JD.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analysis failed.";
  }
}

export const generateText = async (prompt: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI services unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Generation failed.";
  }
};
