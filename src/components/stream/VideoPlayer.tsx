import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js'; // Importation correcte
import 'video.js/dist/video-js.css';
import StreamMessage from './StreamMessage';
import VideoElement from './VideoElement';

type StreamStatus = 'loading' | 'ready' | 'not_available' | 'buffering';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('loading');
  const streamUrl = import.meta.env.VITE_STREAM_URL as string;
  const maxAttempts = 2;
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkAndInitializePlayer = async () => {
      if (attempts >= maxAttempts) {
        console.error('Max attempts reached. Stream not available.');
        setStreamStatus('not_available');
        return;
      }

      try {
        console.log('Checking stream URL:', streamUrl);
        const response = await fetch(streamUrl, { method: 'HEAD' });
        if (response.ok) {
          console.log('Stream is available. Initializing player...');
          setStreamStatus('ready');

          if (!videoRef.current || playerRef.current) return;

          const options: videojs.VideoJsPlayerOptions = {
            fluid: false,
            liveui: true,
            controls: true,
            autoplay: 'muted',
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

          const player = (playerRef.current = videojs(videoRef.current, options));

          player.on('loadedmetadata', () => {
            console.log('Metadata loaded. Stream is ready.');
            setStreamStatus('ready');
          });
          player.on('error', (e) => {
            console.error('Video.js error:', e);
            setStreamStatus('not_available');
          });
          player.on('playing', () => {
            console.log('Stream is playing.');
            setStreamStatus('ready');
          });
          player.on('waiting', () => {
            console.log('Stream is buffering.');
            setStreamStatus('buffering');
          });
        } else {
          console.error('Stream URL is not accessible. Retrying...');
          setAttempts((prev) => prev + 1);
          setStreamStatus('not_available');
        }
      } catch (error) {
        console.error('Error initializing player:', error);
        setAttempts((prev) => prev + 1);
        setStreamStatus('not_available');
      }
    };

    checkAndInitializePlayer();

    return () => {
      if (playerRef.current) {
        console.log('Disposing player...');
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl, attempts]);

  return (
    <div className="video-container">
      {streamStatus === 'not_available' ? (
        <StreamMessage />
      ) : (
        <VideoElement videoRef={videoRef} />
      )}
    </div>
  );
};

export default VideoPlayer;
