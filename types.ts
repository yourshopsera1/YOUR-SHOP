
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  LIVE_VOICE = 'LIVE_VOICE',
  GROUNDING = 'GROUNDING',
  TRANSCRIPTION = 'TRANSCRIPTION'
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thinking?: string;
  images?: string[];
  groundingLinks?: Array<{ uri: string; title: string }>;
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}
