import React, { useContext } from 'react';
import { StreamContext } from '../context/StreamContext.jsx';
import '../css/VideoPlayer.scss';

const VideoPlayer = () => {
  const { stream } = useContext(StreamContext);

  return (
    <div>
      {stream ? (
        <video controls autoPlay width="600">
          <source src={stream} type="application/x-mpegURL" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      ) : (
        <p>Le stream commence bientôt</p>
      )}
    </div>
  );
};

export default VideoPlayer;
