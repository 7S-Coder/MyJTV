import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming'; // Important pour HLS
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('loading'); // 'loading'|'ready'|'error'
  const streamUrl = 'https://stream.dontono.fr/hls/test.m3u8';

  useEffect(() => {
    const initializePlayer = () => {
      if (videoRef.current && !playerRef.current) {
        const player = playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          html5: {
            hls: {
              overrideNative: true,  // Force VideoJS à utiliser son propre HLS
              withCredentials: false // Désactive les credentials CORS
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
          },
          sources: [{
            src: streamUrl,
            type: 'application/x-mpegURL'
          }]
        });

        // Gestion des événements améliorée
        player.on('loadedmetadata', () => {
          console.log('Flux HLS chargé');
          setStreamStatus('ready');
        });

        player.on('error', (e) => {
          console.error('Erreur VideoJS:', player.error());
          setStreamStatus('error');
          
          // Tentative de rechargement après 5s
          setTimeout(() => {
            player.src({ src: streamUrl, type: 'application/x-mpegURL' });
            player.load();
          }, 5000);
        });

        player.on('retryexhausted', () => {
          setStreamStatus('error');
        });
      }
    };

    const timeoutId = setTimeout(initializePlayer, 100); // Petit délai pour le DOM

    return () => {
      clearTimeout(timeoutId);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {streamStatus === 'error' && (
        <div className="stream-message">
          Le stream commence bientôt
        </div>
      )}
      
      {streamStatus !== 'error' && (
        <div data-vjs-player>
          <video 
            ref={videoRef} 
            className="video-js vjs-default-skin fixed-size-video"
            crossOrigin="anonymous" // Important pour CORS
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;