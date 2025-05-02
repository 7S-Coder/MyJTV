import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [streamStatus, setStreamStatus] = useState('loading');
  const streamUrl = 'https://stream.dontono.fr/hls/test/test.m3u8';

  useEffect(() => {
    const initializePlayer = () => {
      if (!videoRef.current || playerRef.current) return;

      const options = {
        fluid: false, // Désactive le comportement fluide par défaut
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
            handlePartialData: true,
            limitRenditionByPlayerDimensions: false,
            smoothQualityChange: true,
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
        sources: [
          {
            src: streamUrl,
            type: 'application/x-mpegURL',
            withCredentials: false,
          },
        ],
        techOrder: ['html5'],
      };

      const player = (playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Player initialized');
      }));

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
              type: 'application/x-mpegURL',
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
      {streamStatus === 'error' ? (
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