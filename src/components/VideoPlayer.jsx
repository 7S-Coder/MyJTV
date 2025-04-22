import React, { useEffect, useRef, useContext } from 'react';
import flvjs from 'flv.js';
import { StreamContext } from '../context/StreamContext.jsx';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const { stream } = useContext(StreamContext);
  const videoRef = useRef(null);
  let flvPlayer = useRef(null);

  useEffect(() => {
    if (videoRef.current && flvjs.isSupported()) {
      // Utilise une URL par défaut si aucun stream n'est défini
      const streamUrl = stream || 'rtmp://localhost/live/stream';

      // Initialise flv.js pour lire le flux RTMP
      flvPlayer.current = flvjs.createPlayer({
        type: 'flv',
        url: streamUrl,
      });
      flvPlayer.current.attachMediaElement(videoRef.current);
      flvPlayer.current.load();
      flvPlayer.current.play();

      return () => {
        if (flvPlayer.current) {
          flvPlayer.current.destroy();
          flvPlayer.current = null;
        }
      };
    }
  }, [stream]);

  return (
    <div className="video-container">
      <video ref={videoRef} className="video-player" controls />
    </div>
  );
};

export default VideoPlayer;