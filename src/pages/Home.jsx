// Home.js
import React from 'react';
import Chat from '../components/chat/Chat'; 
import VideoPlayer from '../components/stream/VideoPlayer';
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