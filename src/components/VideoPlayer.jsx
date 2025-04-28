import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isStreamAvailable, setIsStreamAvailable] = useState(true); // Suivi de la disponibilité du flux
  const streamUrl = 'https://168.231.107.30/hls/test.m3u8';

  useEffect(() => {
    const initializePlayer = () => {
      if (videoRef.current && !playerRef.current) {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: 'auto',
          sources: [
            {
              src: streamUrl,
              type: 'application/x-mpegURL',
            },
          ],
        });

        playerRef.current.on('error', () => {
          console.error('Erreur lors de la lecture du flux HLS.');
          setIsStreamAvailable(false); // Marquer le flux comme indisponible
        });
      }
    };

    // Initialisation différée pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(initializePlayer, 0);

    return () => {
      clearTimeout(timeoutId); // Nettoyage si le composant est démonté
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {!isStreamAvailable && (
        <div className="stream-message">
          Le stream commence bientôt
        </div>
      )}
      {isStreamAvailable && (
        <div data-vjs-player>
          <video ref={videoRef} className="video-js vjs-default-skin fixed-size-video" />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;