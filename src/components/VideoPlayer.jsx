import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('loading');
  const streamUrl = 'https://stream.dontono.fr/hls/test.m3u8';

  useEffect(() => {
    const initializePlayer = () => {
      if (!videoRef.current || playerRef.current) return;

      const options = {
        fluid: true,
        liveui: true,
        controls: true,
        autoplay: true,
        preload: 'auto',
        html5: {
          vhs: {
            overrideNative: true,
            withCredentials: false,
            enableLowInitialPlaylist: true,
            backBufferLength: 60,
            experimentalLLHLS: false,
            // Ajout des options pour gérer les erreurs
            handlePartialData: true,
            limitRenditionByPlayerDimensions: false,
            smoothQualityChange: true,
            bandwidth: {
              // Augmentation de la bande passante par défaut
              default: 2000000
            }
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        sources: [{
          src: streamUrl,
          type: 'application/x-mpegURL',
          withCredentials: false
        }],
        techOrder: ['html5']
      };

      const player = playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player initialized');
      });

      // Gestion des événements améliorée
      player.on('loadedmetadata', () => {
        console.log('Metadata loaded');
        setStreamStatus('ready');
      });

      player.on('error', () => {
        const error = player.error();
        console.error('Player error:', error);
        setStreamStatus('error');
        
        if ([2, 4, 5].includes(error.code)) {
          setTimeout(() => {
            player.src({
              src: `${streamUrl}?t=${Date.now()}`,
              type: 'application/x-mpegURL'
            });
            player.load();
          }, 3000);
        }
      });

      player.on('playing', () => {
        setStreamStatus('ready');
      });

      player.on('waiting', () => {
        setStreamStatus('buffering');
      });

      // Nouveau gestionnaire pour les problèmes de segment
      player.on('segmentmetadata', () => {
        console.log('Segment metadata loaded');
      });

      player.on('retryplaylist', () => {
        console.log('Retrying playlist');
      });
    };

    const timer = setTimeout(initializePlayer, 100);

    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {streamStatus === 'error' && (
        <div className="stream-message error">
          Le stream n'est pas disponible actuellement. Reconnexion en cours...
        </div>
      )}
      
      {streamStatus === 'loading' && (
        <div className="stream-message loading">
          Chargement du stream...
        </div>
      )}
      
      {streamStatus === 'buffering' && (
        <div className="stream-message loading">
          Mise en mémoire tampon...
        </div>
      )}
      
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-fluid"
          crossOrigin="anonymous"
          playsInline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;