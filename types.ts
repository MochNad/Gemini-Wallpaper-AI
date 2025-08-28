export type AspectRatio = '16:9' | '9:16';
export type ImageStyle = 'Default' | 'Photorealistic' | 'Anime' | 'Cyberpunk' | 'Fantasy' | 'Minimalist' | 'Abstract';

export type ModelType = 'phone' | 'laptop' | 'tablet';

export type ImagenModel = 'imagen-4.0-generate-001' | 'imagen-4.0-ultra-generate-001' | 'imagen-4.0-fast-generate-001' | 'imagen-3.0-generate-002';

export interface Device {
  name: string;
  model: ModelType;
  // physical screen aspect ratio (width / height)
  screenAspectRatio: number; 
}
