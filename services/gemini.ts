
import { GoogleGenAI } from "@google/genai";

export const GeminiService = {
  async analyzeVisualSearch(base64Image: string): Promise<string[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          },
          { text: "Analyze this image and provide 5 keywords that describe the artisanal style, material, and category (e.g., 'minimalist', 'stoneware', 'earthy'). Only return the keywords separated by commas." }
        ]
      });
      return response.text?.split(',').map(k => k.trim().toLowerCase()) || [];
    } catch (error) {
      console.error("Visual Search Error:", error);
      return [];
    }
  },

  async translateMarketplace(content: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'English') return content;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following artisanal product content into ${targetLanguage}. Maintain the sophisticated, poetic, and luxury brand voice. Content: "${content}"`,
        config: { temperature: 0.3 }
      });
      return response.text || content;
    } catch (error) {
      console.error("Translation Error:", error);
      return content;
    }
  },

  async auditPricing(productName: string, currentPrice: number, trends: any[]): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const trendContext = trends.map(t => `${t.topic}: ${t.trend}`).join('; ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a luxury marketplace analyst. Given the product "${productName}" priced at $${currentPrice}, and these current market trends: [${trendContext}], suggest if the price is competitive. Provide a 2-sentence recommendation.`,
      });
      return response.text || "Pricing seems aligned with current boutique standards.";
    } catch (error) {
      return "Unable to perform audit at this time.";
    }
  },

  async getMarketplaceTrends(): Promise<{ topic: string, trend: string, sourceUrl: string }[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "What are 3 current trending topics in the global artisanal and handmade marketplace for 2024/2025? Provide short titles and a 1-sentence description. Focus on home decor, fashion, and lifestyle.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const firstSource = (sources[0] as any)?.web?.uri || "https://google.com";
      const lines = response.text?.split('\n').filter(l => l.trim().length > 10).slice(0, 3) || [];
      return lines.map(line => ({
        topic: line.split(':')[0]?.replace(/[*#-]/g, '').trim() || "Artisan Craft",
        trend: line.split(':')[1]?.trim() || line.trim(),
        sourceUrl: firstSource
      }));
    } catch (error) {
      return [
        { topic: "Sustainable Texturing", trend: "Raw, unrefined materials are dominating home decor this season.", sourceUrl: "#" },
        { topic: "Neo-Classical Ceramics", trend: "Ancient silhouettes are making a comeback in modern kitchens.", sourceUrl: "#" }
      ];
    }
  },

  async generateProductImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-end commercial photo of ${prompt}. Cinematic lighting, high-resolution.` }] },
      config: { imageConfig: { aspectRatio: "4:3" } }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data");
  },

  async enhanceDescription(productName: string, category: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Poetic 2-sentence description for ${category} product "${productName}".`,
    });
    return response.text || "Handmade excellence.";
  },

  async generateStoreStory(storeName: string, businessType: string, bio: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Brand story for ${storeName} (${businessType}). Seed: ${bio}.`,
    });
    return response.text || "Our journey...";
  },

  async generatePromoVideo(productName: string, description: string, imageUrl: string, onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic promo for ${productName}. ${description}`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      onStatusUpdate("Rendering frames...");
      operation = await ai.operations.getVideosOperation({operation: operation});
    }
    return `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
  }
};

export const decodeBase64Audio = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const encodeAudioBlob = (data: Float32Array) => {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' };
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
