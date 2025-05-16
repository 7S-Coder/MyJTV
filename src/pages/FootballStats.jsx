import React, { useEffect, useState } from 'react';
import '../css/pages/FootballStats.scss';

const API_URL = 'hhttps://free-api-live-football-data.p.rapidapi.com/football-get-match-score?eventid=4621624';
const API_KEY = '0f5076d593msh0a9f0a41a9a8a5ep1ebcf2jsn652272b502bb';
const API_HOST = 'free-api-live-football-data.p.rapidapi.com';

const FootballStats = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur API: ' + res.status);
        return res.json();
      })
      .then((data) => {
        setResults(data.data || []);
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
        {results.map((player, idx) => (
          <li key={idx}>
            <strong>{player.player_name}</strong> - {player.team_name} <br />
            Nationalité: {player.nationality} | Âge: {player.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FootballStats;
