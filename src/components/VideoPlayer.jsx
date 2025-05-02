import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('loading');
  const streamUrl = import.meta.env.VITE_STREAM_URL;
  const maxAttempts = 2; // Nombre maximum de tentatives
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkStreamAvailability = async () => {
      if (attempts >= maxAttempts) {
        console.warn('Nombre maximum de tentatives atteint. Arrêt des vérifications.');
        setStreamStatus('not_available');
        return;
      }

      try {
        const response = await fetch(streamUrl, { method: 'HEAD' });
        if (response.ok) {
          initializePlayer();
        } else {
          console.warn('Le flux n\'est pas disponible. Nouvelle tentative...');
          setAttempts((prev) => prev + 1);
          setStreamStatus('not_available');
        }
      } catch (error) {
        console.warn('Erreur lors de la vérification du flux. Nouvelle tentative...');
        setAttempts((prev) => prev + 1);
        setStreamStatus('not_available');
      }
    };

    const initializePlayer = () => {
      if (!videoRef.current || playerRef.current) return;

      const options = {
        fluid: false,
        liveui: true,
        controls: true,
        autoplay: true,
        preload: 'auto',
        html5: {
          vhs: {
            overrideNative: true,
          },
        },
        sources: [
          {
            src: streamUrl,
            type: 'application/x-mpegURL',
          },
        ],
      };

      const player = (playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player initialized');
      }));

      player.on('loadedmetadata', () => {
        setStreamStatus('ready');
      });

      player.on('error', () => {
        console.warn('Erreur lors de la lecture du flux.');
        setStreamStatus('not_available');
      });

      player.on('playing', () => {
        setStreamStatus('ready');
      });

      player.on('waiting', () => {
        setStreamStatus('buffering');
      });
    };

    checkStreamAvailability();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl, attempts]);

  return (
    <div className="video-container">
      {streamStatus === 'not_available' ? (
        <div className="stream-message">
          Le stream commence bientôt.
        </div>
      ) : (
        <div data-vjs-player style={{ width: '100%', height: '100%' }}>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            crossOrigin="anonymous"
            playsInline
            webkit-playsinline="true"
            x-webkit-airplay="allow"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;