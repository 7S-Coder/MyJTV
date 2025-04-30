import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import '@videojs/http-streaming';
import 'video.js/dist/video-js.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const streamUrl = 'https://stream.dontono.fr/hls/test.m3u8';

  useEffect(() => {
    const player = playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      html5: {
        hls: {
          overrideNative: true,
          withCredentials: false,
          handleManifestRedirects: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
      sources: [{
        src: streamUrl,
        type: 'application/x-mpegURL'
      }]
    });

    player.on('error', () => {
      console.error('Player error:', player.error());
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <video 
        ref={videoRef} 
        className="video-js vjs-default-skin"
        crossOrigin="anonymous"
        playsInline
      />
    </div>
  );
};