// Home.js
import React from'react';
import Chat from'../components/Chat.jsx';
import VideoPlayer from'../components/VideoPlayer.jsx';

const Home = () => {
  return (
    <main>
      <VideoPlayer />
      <Chat />
    </main>
  );
};

export default Home;