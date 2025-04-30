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
        controls: true,
        autoplay: true,
        preload: 'auto',
        html5: {
          vhs: {
            overrideNative: true,
            withCredentials: false,
            enableLowInitialPlaylist: true,
            backBufferLength: 60
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        sources: [{
          src: streamUrl,
          type: 'application/x-mpegURL'
        }]
      };

      const player = playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player is ready');
      });

      // Gestion des événements
      player.on('loadedmetadata', () => {
        console.log('Metadata loaded');
        setStreamStatus('ready');
      });

      player.on('error', () => {
        const error = player.error();
        console.error('Player error:', error);
        setStreamStatus('error');
        
        if (error.code === 2 || error.code === 4) {
          setTimeout(() => {
            player.src({ src: streamUrl, type: 'application/x-mpegURL' });
            player.load();
          }, 5000);
        }
      });

      player.on('playing', () => {
        setStreamStatus('ready');
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
        <div className="stream-message">
          Le stream sera disponible prochainement
        </div>
      )}
      
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin fixed-size-video"
          crossOrigin="anonymous"
          playsInline={true}
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          data-setup='{}'
        />
      </div>
    </div>
  );
};

export default VideoPlayer;