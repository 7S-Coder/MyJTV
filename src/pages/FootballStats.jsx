import React, { useEffect, useState } from 'react';
import '../css/pages/FootballStats.scss';

const FootballStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          'https://cors-anywhere.herokuapp.com/https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/2022-02-11',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'sportapi7.p.rapidapi.com',
              'x-rapidapi-key': '0f5076d593msh0a9f0a41a9a8a5ep1ebcf2jsn652272b502b', // Replace with your actual API key
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStats(data.events || []); // Adjust based on API response structure
      } catch (err) {
        console.error('Error fetching data:', err); // Log the error for debugging
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="football-stats-page">
      <h1>Résultats & Statistiques Football</h1>
      {loading && <p>Chargement des données...</p>}
      {error && <p>Erreur : {error}</p>}
      {!loading && !error && (
        <ul>
          {stats.map((event, index) => (
            <li key={index}>{event.name} - {event.date}</li> // Adjust based on API response structure
          ))}
        </ul>
      )}
    </div>
  );
};

export default FootballStats;
