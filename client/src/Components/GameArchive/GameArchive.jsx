import React, { useEffect, useState } from 'react';
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
import './GameArchive.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GameArchive = () => {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

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

  const addGame = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/games', { title, rating, comment });
      setTitle('');
      setRating(1);
      setComment('');
      fetchGames();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: games.map(g => g.title),
    datasets: [
      {
        label: 'Rating',
        data: games.map(g => g.rating),
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  };

  return (
    <div className="gameArchive">
      <h2>My Games</h2>
      <form onSubmit={addGame} className="gameForm">
        <input
          type="text"
          placeholder="Game title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        />
        <textarea
          placeholder="Your opinion"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button type="submit">Add Game</button>
      </form>

      <div className="gamesList">
        {games.map(game => (
          <div key={game.id} className="gameItem">
            <h3>{game.title}</h3>
            <p>Rating: {game.rating}</p>
            <p>{game.comment}</p>
          </div>
        ))}
      </div>

      <div className="chartContainer">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default GameArchive;
