import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddShowtimeRequest, Movie, Hall } from '../types';
import { showtimeService, movieService, hallService } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

const AddShowtime: React.FC = () => {
  const [formData, setFormData] = useState<AddShowtimeRequest>({
    startTime: '',
    movieId: 0,
    hallId: 0,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoviesAndHalls();
  }, []);

  const fetchMoviesAndHalls = async () => {
    try {
      setInitialLoading(true);
      const [moviesData, hallsData] = await Promise.all([
        movieService.getAllMovies(),
        hallService.getAllHalls(),
      ]);
      setMovies(moviesData);
      setHalls(hallsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'movieId' || name === 'hallId' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.startTime || !formData.movieId || !formData.hallId) {
        setError('Please fill in all fields');
        return;
      }

      await showtimeService.addShowtime(formData);
      setSuccess('Showtime added successfully!');
      setTimeout(() => navigate('/showtimes'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add showtime');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  if (loading) {
    return <LoadingSpinner message="Adding showtime..." />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Add New Showtime</h1>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="movieId">Movie</label>
            <select
              id="movieId"
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              required
            >
              <option value={0}>Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="hallId">Hall</label>
            <select
              id="hallId"
              name="hallId"
              value={formData.hallId}
              onChange={handleChange}
              required
            >
              <option value={0}>Select a hall</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Showtime
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShowtime;

