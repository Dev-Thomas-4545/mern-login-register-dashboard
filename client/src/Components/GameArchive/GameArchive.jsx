import React, { useEffect, useState } from 'react';
import './GameArchive.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GameArchive = () => {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const fetchGames = async () => {
    try {
      const res = await axios.get('http://localhost:3002/games');
      setGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/games', { title, rating, review });
      setTitle('');
      setRating(0);
      setReview('');
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const ratingCounts = [1, 2, 3, 4, 5].map(r => games.filter(g => g.rating === r).length);

  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Notes',
        data: ratingCounts,
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  return (
    <div className="gameArchive">
      <h2>Mes Jeux</h2>
      <form onSubmit={addGame} className="gameForm">
        <input
          type="text"
          placeholder="Titre du jeu"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Note"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          required
        />
        <textarea
          placeholder="Votre avis"
          value={review}
          onChange={e => setReview(e.target.value)}
          required
        ></textarea>
        <button type="submit">Ajouter</button>
      </form>

      <ul className="gameList">
        {games.map(g => (
          <li key={g.id} className="gameItem">
            <strong>{g.title}</strong> - {g.rating}/5
            <p>{g.review}</p>
          </li>
        ))}
      </ul>

      <div className="chartContainer">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default GameArchive;
