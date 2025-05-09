// Home.js
import React from 'react';
import Chat from '../components/chat/Chat'; 
import VideoPlayer from '../components/stream/VideoPlayer';
import '../css/pages/Home.scss';
import Navbar from '../components/Navbar'; // Assurez-vous que le chemin est correct

const Home = () => {
  return (
    <main>
     <Navbar />
      <div className="box">
        <VideoPlayer />
        <Chat />
      </div>
    </main>
  );
};

export default Home;