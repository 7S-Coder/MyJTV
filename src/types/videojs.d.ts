import 'video.js';

declare module 'video.js' {
  export interface VideoJsPlayer {
    dispose(): void;
    on(event: string, callback: () => void): void;
    // Ajoutez d'autres méthodes et propriétés si nécessaire
  }

  export interface VideoJsPlayerOptions {
    autoplay?: boolean | 'muted' | 'play'; // Étendre le type autoplay
    fluid?: boolean;
    liveui?: boolean;
    controls?: boolean;
    preload?: string;
    html5?: {
      vhs?: {
        overrideNative?: boolean;
      };
    };
    sources?: Array<{
      src: string;
      type: string;
    }>;
  }

  export interface PlayerOptions {
    fluid?: boolean;
    liveui?: boolean;
    controls?: boolean;
    autoplay?: boolean | 'muted' | 'play';
    preload?: string;
    html5?: {
      vhs?: {
        overrideNative?: boolean;
      };
    };
    sources?: Array<{
      src: string;
      type: string;
    }>;
  }

  export default function videojs(
    element: HTMLVideoElement,
    options?: VideoJsPlayerOptions
  ): VideoJsPlayer;
}
