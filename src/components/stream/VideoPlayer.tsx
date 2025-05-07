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
        setStreamStatus('not_available');
        return;
      }

      try {
        const response = await fetch(streamUrl, { method: 'HEAD' });
        if (response.ok) {
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
            userActions: {
              seek: false, // Désactiver la recherche manuelle
            },
            sources: [
              {
                src: streamUrl,
                type: 'application/x-mpegURL',
              },
            ],
          };

          const player = (playerRef.current = videojs(videoRef.current, options));

          let lastTime = 0; // Stocke la position maximale atteinte

          player.on('timeupdate', () => {
            if (player.currentTime() < lastTime) {
              player.currentTime(lastTime); // Empêche de revenir en arrière
            } else {
              lastTime = player.currentTime(); // Met à jour la position maximale
            }
          });

          player.on('loadedmetadata', () => {
            setStreamStatus('ready');
          });
          player.on('error', () => {
            setStreamStatus('not_available');
          });
          player.on('playing', () => {
            setStreamStatus('ready');
          });
          player.on('waiting', () => {
            setStreamStatus('buffering');
          });
        } else {
          setAttempts((prev) => prev + 1);
          setStreamStatus('not_available');
        }
      } catch (error) {
        setAttempts((prev) => prev + 1);
        setStreamStatus('not_available');
      }
    };

    checkAndInitializePlayer();

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
        <StreamMessage />
      ) : (
        <VideoElement videoRef={videoRef} />
      )}
    </div>
  );
};

export default VideoPlayer;
