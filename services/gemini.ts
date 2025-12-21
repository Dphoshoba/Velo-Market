
import { GoogleGenAI } from "@google/genai";

export const GeminiService = {
  async enhanceDescription(productName: string, category: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a compelling, poetic, 2-sentence marketing description for a ${category} product named "${productName}". Keep it concise and professional for a high-end marketplace.`,
        config: { temperature: 0.7 }
      });
      return response.text || "Quality crafted product perfect for your lifestyle.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An amazing handmade piece built with care and precision.";
    }
  },

  async generateStoreStory(storeName: string, businessType: string, bio: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a high-end brand consultant. Generate a sophisticated 3-paragraph "Our Story" section for a store named "${storeName}" which is a ${businessType}. Use this tagline as a seed: "${bio}". Focus on artisanal craft, sustainability, and the human element.`,
        config: { temperature: 0.8 }
      });
      return response.text || "Our journey began with a simple passion for quality craft...";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Founded on the principles of artisanal excellence and community support.";
    }
  },

  async generatePromoVideo(productName: string, description: string, imageUrl: string, onStatusUpdate: (msg: string) => void): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    onStatusUpdate("Initializing high-fidelity rendering engine...");
    
    // Convert image URL to base64 if it's a proxy/data URI or fetch it
    // For demo simplicity, we'll prompt purely with text if we can't easily get the bytes,
    // but the API supports images. Let's assume text prompt for now for reliability.
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, high-end commercial for an artisanal product named "${productName}". The product is described as: ${description}. The aesthetic is minimalist, soft lighting, 4k, macro shots of textures.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onStatusUpdate("Crafting cinematic frames with Veo 3.1...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      onStatusUpdate("Polishing textures and lighting (70% complete)...");
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed to return a URI.");
    
    return `${downloadLink}&key=${process.env.API_KEY}`;
  }
};

// Live API Helpers
export const decodeBase64Audio = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeAudioBlob = (data: Float32Array) => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
