import React, { useEffect, useRef, useContext, useState } from 'react';
import flvjs from 'flv.js';
import { StreamContext } from '../context/StreamContext.jsx';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const { stream } = useContext(StreamContext);
  const videoRef = useRef(null);
  let flvPlayer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current && flvjs.isSupported()) {
      const streamUrl = stream || 'http://192.168.1.20/live/stream.flv';

      // Vérifie si l'URL du flux est accessible
      fetch(streamUrl, { method: 'HEAD' })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Flux inaccessible : ${response.statusText}`);
          }

          // Initialise flv.js pour lire le flux
          flvPlayer.current = flvjs.createPlayer({
            type: 'flv',
            url: streamUrl,
          });
          flvPlayer.current.attachMediaElement(videoRef.current);
          flvPlayer.current.load();
          flvPlayer.current.play();

          flvPlayer.current.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
            console.error(`Erreur FLV.js : ${errorType}, détail : ${errorDetail}`);
          });
        })
        .catch((error) => {
          console.error('Erreur lors de l’accès au flux :', error.message);
        });
    }
  };

  useEffect(() => {
    return () => {
      if (flvPlayer.current) {
        flvPlayer.current.destroy();
        flvPlayer.current = null;
      }
    };
  }, []);

  return (
    <div className="video-container">
      {!isPlaying && (
        <button className="play-button" onClick={handlePlay}>
          Play
        </button>
      )}
      <video ref={videoRef} className="video-player" controls style={{ display: isPlaying ? 'block' : 'none' }} />
    </div>
  );
};

export default VideoPlayer;