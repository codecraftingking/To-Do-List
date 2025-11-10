import { GoogleGenAI, Type } from "@google/genai";
import { Todo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getSuggestions(todos: Todo[]): Promise<string[]> {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Based on the following to-do list, suggest 3 new, related, and actionable tasks.
    The tasks should be concise. Avoid suggesting tasks that are already on the list.
    Return the suggestions as a JSON array of strings.

    Current Tasks:
    ${todos.length > 0 ? todos.map(t => `- [${t.completed ? 'x' : ' '}] ${t.text}`).join('\n') : "The list is empty. Suggest some common starting tasks like 'Create a grocery list' or 'Plan week's schedule'."}

    Your response must be a valid JSON array of strings, for example: ["New task 1", "New task 2", "New task 3"].
    Do not include any other text or markdown formatting in your response.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
            },
        },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);
    
    if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
      return suggestions;
    } else {
      console.error("Gemini API returned an unexpected format:", suggestions);
      return [];
    }

  } catch (error) {
    console.error("Error calling Gemini API for suggestions:", error);
    throw new Error("Failed to fetch suggestions from Gemini API.");
  }
}

export async function getCategoryForTask(taskText: string): Promise<string> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    Categorize the following to-do task into a single word.
    Examples: "Personal", "Work", "Health", "Finance", "Shopping", "Home", "Social".
    If unsure, use a general category like "General".
    Return only the single category word as a plain string.

    Task: "${taskText}"

    Category:
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    
    // Simple sanitization, remove potential markdown and trim
    return response.text.replace(/[*_`]/g, '').trim() || "General";
  } catch (error) {
    console.error("Error calling Gemini API for category:", error);
    // Return a default category on error
    return "General";
  }
}

export async function getCategorySuggestions(taskText: string): Promise<string[]> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    Suggest up to 5 relevant, single-word categories for the following to-do task.
    Common categories include: "Personal", "Work", "Health", "Finance", "Shopping", "Home", "Social", "Urgent".
    Return the suggestions as a JSON array of strings.

    Task: "${taskText}"

    Your response must be a valid JSON array of strings, for example: ["Work", "Project", "Urgent"].
    Do not include any other text or markdown formatting in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText);

    if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
      return suggestions;
    } else {
      console.error("Gemini API returned an unexpected format for category suggestions:", suggestions);
      return [];
    }
  } catch (error) {
    console.error("Error calling Gemini API for category suggestions:", error);
    // Return empty array on error, the UI can handle this.
    return [];
  }
}
