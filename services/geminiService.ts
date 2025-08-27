import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, ImageStyle, ImagenModel } from '../types';

const defaultAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stylePrompts: Record<ImageStyle, string> = {
  'Default': '3D render, digital art, cinematic lighting, hyperrealistic, octane render, unreal engine, 8k, high detail',
  'Photorealistic': 'photorealistic, photography, cinematic, 8k, detailed, professional color grading, sharp focus',
  'Anime': 'anime style, vibrant colors, detailed illustration, digital painting, trending on pixiv, studio ghibli aesthetic',
  'Cyberpunk': 'cyberpunk aesthetic, neon lighting, futuristic city, dystopian, blade runner style, tech noir',
  'Fantasy': 'high fantasy art, epic, detailed, magical, lord of the rings style, matte painting, concept art',
  'Minimalist': 'minimalist design, clean lines, simple shapes, solid colors, modern aesthetic',
  'Abstract': 'abstract art, non-representational, geometric shapes, expressive brushstrokes, colorful',
};

export async function generateWallpaper(prompt: string, aspectRatio: AspectRatio, style: ImageStyle, model: ImagenModel, apiKey?: string): Promise<string> {
  try {
    const userProvidedApiKey = apiKey && apiKey.trim();
    const ai = userProvidedApiKey ? new GoogleGenAI({ apiKey: userProvidedApiKey }) : defaultAi;

    const styleEnhancer = stylePrompts[style] || stylePrompts['Default'];
    const enhancedPrompt = `${prompt}, ${styleEnhancer}, wallpaper`;

    const response = await ai.models.generateImages({
      model: model,
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages.length === 0 || !response.generatedImages[0].image.imageBytes) {
      throw new Error("The API did not return any images.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating wallpaper:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the wallpaper.');
  }
}