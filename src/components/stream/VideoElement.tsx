import React from 'react';

interface VideoElementProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoElement: React.FC<VideoElementProps> = ({ videoRef }) => (
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
);

export default VideoElement;
