import React, { useState, useContext } from 'react';
import { StreamContext } from '../../context/StreamContext.jsx';
import { createLiveKitStreamKey } from '../../utils/livekit/livekitUtils.js';
import AdminNavbar from '../../components/AdminNavbar.jsx';
import '../../css/admin/launchstream.scss';

const LaunchStream = () => {
  const [streamKey, setStreamKey] = useState('');
  const { setStream } = useContext(StreamContext);

  const handleStartStream = async () => {
    try {
      console.log('Generating stream key...');
      const { streamUrl, key } = await createLiveKitStreamKey(); // Generate stream key and URL
      setStream(`${streamUrl}/hls/${key.key}`); // Set HLS URL for playback
      setStreamKey(key);
      console.log('Stream key generated successfully:', key);
    } catch (error) {
      console.error('Failed to generate stream key:', error);
      alert('Failed to generate stream key. Please check the console for details.');
    }
  };

  const handleGenerateStream = async () => {
    try {
      const { server, key } = await generateStreamKey();
      setStreamKey({ server, key });
      console.log('Stream Key:', key);
    } catch (error) {
      console.error('Erreur lors de la génération de la clé de stream:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <main>
        <button onClick={handleStartStream}>Lancer un Stream</button>
        <button onClick={handleGenerateStream}>Générer une Clé de Stream</button>
        {streamKey && (
          <div>
            <p><strong>Serveur:</strong> {streamKey.server}</p>
            <p><strong>Clé de Stream:</strong> {streamKey.key}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LaunchStream;
