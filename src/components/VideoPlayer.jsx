import React, { useEffect, useRef, useContext } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { StreamContext } from '../context/StreamContext.jsx';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const { stream } = useContext(StreamContext);
  const videoRef = useRef(null);
  let player = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      // Initialise Video.js si ce n'est pas déjà fait
      player.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        fluid: true,
        responsive: true,
        sources: [{ src: stream, type: 'application/x-mpegURL' }],
      });

      return () => {
        if (player.current) {
          player.current.dispose();
        }
      };
    }
  }, [stream]);

  return (
    <div className="video-container">
      {stream ? (
        <video ref={videoRef} className="video-js vjs-default-skin" />
      ) : (
        <p>Le stream commence bientôt</p>
      )}
    </div>
  );
};

export default VideoPlayer;
