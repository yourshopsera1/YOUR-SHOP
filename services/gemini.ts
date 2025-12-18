
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Note: process.env.API_KEY is handled externally.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  // Fast AI Response
  async getFastResponse(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    return response.text;
  },

  // Smart Chat with Thinking Mode
  async chatWithThinking(prompt: string, history: any[] = []) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  },

  // Image Generation (Pro)
  async generateImage(prompt: string, aspectRatio: AspectRatio = '1:1', imageSize: ImageSize = '1K') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio, imageSize }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Edit Image with Nano Banana
  async editImage(prompt: string, base64Image: string, mimeType: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Generate Video (Veo)
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9', startImage?: string) {
    const ai = getAI();
    const config: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio
      }
    };

    if (startImage) {
      config.image = {
        imageBytes: startImage.split(',')[1],
        mimeType: 'image/png'
      };
    }

    let operation = await ai.models.generateVideos(config);
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  // Grounding (Search)
  async searchGrounding(query: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web).filter(Boolean) || []
    };
  },

  // Grounding (Maps)
  async mapsGrounding(query: string, location?: { latitude: number, longitude: number }) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: { latLng: location }
        }
      },
    });
    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.maps).filter(Boolean) || []
    };
  },

  // TTS
  async textToSpeech(text: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  },

  // Audio Transcription
  async transcribeAudio(base64Audio: string, mimeType: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [{
          inlineData: { data: base64Audio.split(',')[1], mimeType },
        }, {
          text: "Please transcribe this audio accurately."
        }]
      }
    });
    return response.text;
  },

  // Image/Video Understanding
  async analyzeMedia(prompt: string, mediaData: string, mimeType: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: mediaData.split(',')[1], mimeType } },
          { text: prompt }
        ]
      }
    });
    return response.text;
  }
};
