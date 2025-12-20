
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIDescriptionOption {
  vibe: string;
  text: string;
}

export const GeminiService = {
  async generateDescriptionOptions(productName: string, category: string): Promise<AIDescriptionOption[]> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 distinct, compelling marketing descriptions for a ${category} product named "${productName}". 
        Options should follow these vibes: 
        1. "Luxury" (high-end, exclusive language), 
        2. "Minimalist" (short, punchy, modern), 
        3. "Storyteller" (poetic, focus on craft/origin). 
        Return as a JSON array of objects with keys "vibe" and "text".`,
        config: {
          temperature: 0.8,
          // Use JSON response format with a schema for reliability.
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                vibe: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["vibe", "text"]
            }
          }
        }
      });
      
      // Access the text property directly (it's a getter, not a method).
      const jsonStr = response.text?.trim();
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
      throw new Error("Empty AI response");
    } catch (error) {
      console.error("Gemini Error:", error);
      return [
        { vibe: "Classic", text: `A beautifully crafted ${productName} from our ${category} collection.` },
        { vibe: "Modern", text: `Elevate your space with this unique ${productName}. Quality you can feel.` },
        { vibe: "Artisanal", text: `Discover the story behind the ${productName}. Handcrafted excellence.` }
      ];
    }
  },

  async generateProductImage(productName: string, category: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `A high-quality, professional studio product photograph of a ${productName}, category: ${category}. Clean neutral background, soft professional lighting, 4k resolution, centered composition.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "4:3"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return null;
    }
  }
};
