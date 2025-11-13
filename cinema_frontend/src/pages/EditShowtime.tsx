import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showtimeService, movieService, hallService } from '../services/api';
import { Movie, Hall, AddShowtimeRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/Form.css';

const EditShowtime: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddShowtimeRequest>({
    movieId: 0,
    hallId: 0,
    startTime: '',
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (showtimeId) {
      fetchData();
    }
  }, [showtimeId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showtime, moviesData, hallsData] = await Promise.all([
        showtimeService.getShowtimeById(parseInt(showtimeId!)),
        movieService.getAllMovies(),
        hallService.getAllHalls(),
      ]);

      setFormData({
        movieId: showtime.movie?.id || 0,
        hallId: showtime.hall?.id || 0,
        startTime: showtime.startTime,
      });
      setMovies(moviesData);
      setHalls(hallsData);
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'movieId' || name === 'hallId' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.movieId || !formData.hallId || !formData.startTime) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      await showtimeService.updateShowtime(parseInt(showtimeId!), formData);
      setSuccess('Showtime updated successfully!');
      setTimeout(() => navigate('/showtimes'), 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update showtime';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading showtime details..." />;
  }

  if (submitting) {
    return <LoadingSpinner message="Updating showtime..." />;
  }

  return (
    <div className="add-showtime-container">
      <div className="add-showtime-card">
        <h1>Edit Showtime</h1>

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
              <option value="">Select a movie</option>
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
              <option value="">Select a hall</option>
              {halls.map((hall) => (
                <option key={hall.id} value={hall.id}>
                  {hall.name} ({hall.totalSeats} seats)
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
            Update Showtime
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/showtimes')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShowtime;

