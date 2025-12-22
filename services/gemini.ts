
import { GoogleGenAI, Type } from "@google/genai";

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

  async getInventoryOpportunities(category: string): Promise<{ idea: string, reasoning: string, source: string }[]> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `What are 2 specific product types currently gaining high search interest in the "${category}" artisan niche? Search for recent 2024/2025 consumer trends. 
        Return a JSON array of objects with fields: "idea" (product name), "reasoning" (1 sentence why), and "source" (URL to a trend report).`,
        config: { 
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }] 
        },
      });
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async generateProductImage(prompt: string, base64Reference?: string, highQuality: boolean = false): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const parts: any[] = [{ text: `High-end professional commercial studio photography of ${prompt}. Cinematic lighting, minimalist background, 8k resolution, tack sharp focus, luxury brand aesthetic.` }];
    
    if (base64Reference) {
      parts.push({
        inlineData: {
          data: base64Reference.includes('base64,') ? base64Reference.split(',')[1] : base64Reference,
          mimeType: 'image/jpeg'
        }
      });
      parts[0].text = `Using this image as a structural and material reference, create a high-end, professionally lit commercial studio photograph of the product. The result should look like a premium luxury catalog shot of: ${prompt}. Maintain the core shape and texture of the original object but dramatically improve lighting, background, and overall professional appeal.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: { 
        imageConfig: { 
          aspectRatio: "4:3",
          ...(highQuality ? { imageSize: "1K" } : {})
        } 
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data generated");
  },

  async enhanceDescription(productName: string, notes: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a luxury copywriter for an artisan marketplace. Transform these basic notes into a poetic, compelling 2-sentence product description.
      Product: ${productName}
      Notes: ${enhancedNotes(notes)}
      Return only the description.`,
    });
    return response.text || notes;
  },

  async generateStorePersona(storeName: string, businessType: string, bio: string): Promise<{ tagline: string, narrative: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a luxury brand strategist. Create a professional brand identity for a store called "${storeName}" which is a "${businessType}". The current bio is: "${bio}". 
      Return a JSON object with two fields: "tagline" (one punchy sentence) and "narrative" (two paragraphs of compelling brand story).`,
      config: { responseMimeType: "application/json" }
    });
    try {
      const data = JSON.parse(response.text || '{}');
      return {
        tagline: data.tagline || "Artisan excellence for the modern world.",
        narrative: data.narrative || "Our journey began with a simple vision: to bridge the gap between traditional craft and contemporary living."
      };
    } catch (e) {
      return { tagline: bio, narrative: "Our brand story is currently being curated." };
    }
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

function enhancedNotes(n: string) { return n; }

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
