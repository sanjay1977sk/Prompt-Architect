import { GoogleGenAI } from "@google/genai";
import { ModelType, PromptCriteria } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the world's leading Prompt Engineer and LLM Architect. 
Your goal is to take a user's rough idea, topic, or request and transform it into a "Perfect Prompt" optimized for high-performance Large Language Models (like Gemini, GPT-4, Claude).

Follow this framework when constructing the prompt:
1. **Persona/Role**: Define who the AI should act as (e.g., "Act as a Senior Data Scientist").
2. **Context**: Provide necessary background info.
3. **Task**: Clear, action-oriented objective.
4. **Constraints/Rules**: Specific do's and don'ts (e.g., "No jargon," "Under 200 words").
5. **Output Format**: How the result should look (e.g., Markdown table, JSON, bullet points).
6. **Tone**: The desired voice (e.g., Professional, Witty, Academic).

**Output Rules:**
- Return ONLY the optimized prompt.
- Do not add conversational filler like "Here is your prompt".
- Use Markdown formatting for readability within the prompt itself.
- If the user's input is too vague, make reasonable expert assumptions to flesh it out, but keep it versatile.
`;

export const generateOptimizedPrompt = async (
  input: string | PromptCriteria, 
  model: ModelType = ModelType.FAST
): Promise<string> => {
  try {
    let userContent = "";
    
    if (typeof input === 'string') {
      userContent = `Create a perfect prompt for this topic: "${input}"`;
    } else {
      userContent = `Construct a perfect prompt based on these specific criteria:
      
      ROLE/PERSONA: ${input.role || "Not specified (Suggest best fit)"}
      TASK/OBJECTIVE: ${input.task}
      CONTEXT: ${input.context || "None provided"}
      DESIRED FORMAT: ${input.format || "Not specified"}
      TONE/STYLE: ${input.tone || "Not specified"}
      
      Synthesize these into a cohesive, single-prompt block.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: userContent }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini");
    }
    return text;
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};