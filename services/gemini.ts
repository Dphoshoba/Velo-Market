import { GoogleGenAI } from "@google/genai";

export const GeminiService = {
  async enhanceDescription(productName: string, category: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a compelling, poetic, 2-sentence marketing description for a ${category} product named "${productName}". Keep it concise and professional for a high-end marketplace.`,
        config: {
          temperature: 0.7,
        }
      });
      // Direct access to text property as per current @google/genai guidelines
      return response.text || "Quality crafted product perfect for your lifestyle.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An amazing handmade piece built with care and precision.";
    }
  }
};