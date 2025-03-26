import React, { useState } from 'react';

const LaunchStream = () => {
  const [streamKey, setStreamKey] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLaunchStream = () => {
    // Simuler la génération d'une clé de stream
    const generatedKey = `live_${Math.random().toString(36).substr(2, 10)}`;
    setStreamKey(generatedKey);

    // Simuler la connexion à Livestream
    console.log('Connexion à Livestream avec la clé:', generatedKey);
    setSuccessMessage('Stream lancé avec succès !');

    // Effacer le message de succès après 2 secondes
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <div>
      <h1>Lancer un Stream</h1>
      <button onClick={handleLaunchStream}>Lancer un stream</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {streamKey && (
        <div>
          <p>Clé de stream : <strong>{streamKey}</strong></p>
          <p>Utilisez cette clé dans OBS pour démarrer le stream.</p>
        </div>
      )}
    </div>
  );
};

export default LaunchStream;
