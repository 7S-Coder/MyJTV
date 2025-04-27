// Home.js
import React from 'react';
import Chat from '../components/Chat.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import '../css/Home.scss';

const Home = () => {
  return (
    <main>
      <div className="box">
        <VideoPlayer />
        <Chat />
      </div>
    </main>
  );
};

export default Home;