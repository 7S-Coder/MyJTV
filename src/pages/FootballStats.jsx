import React, { useEffect, useState } from 'react';
import '../css/pages/FootballStats.scss'; // Assurez-vous que le chemin est correct

const API_URL = 'https://api-football-v1.p.rapidapi.com/v3/'; // Remplacez par l'API de votre choix
const API_KEY = 'VOTRE_CLE_API'; // Remplacez par votre clé API

const FootballStats = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Exemple: récupération des matchs de la journée
    fetch(`${API_URL}fixtures?live=all`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.response || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="football-stats-page">
      <h1>Résultats & Statistiques Football</h1>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      <ul>
        {results.map((match, idx) => (
          <li key={idx}>
            {/* Affichez ici les infos du match selon la structure de l'API */}
            {JSON.stringify(match)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FootballStats;
