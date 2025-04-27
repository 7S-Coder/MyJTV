import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const streamUrl = 'http://168.231.107.30/hls/test.m3u8';

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
          setErrorMessage('Impossible de lire le flux. Vérifiez la connexion ou l’URL.');
        });
      }
    };

    // Delay initialization slightly to ensure the DOM is ready
    const timeoutId = setTimeout(initializePlayer, 0);

    return () => {
      clearTimeout(timeoutId); // Clear timeout if the component unmounts
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-default-skin fixed-size-video" />
      </div>
    </div>
  );
};

export default VideoPlayer;