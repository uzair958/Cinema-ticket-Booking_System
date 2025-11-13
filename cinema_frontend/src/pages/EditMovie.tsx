import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../services/api';
import { AddMovieRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/Form.css';

const EditMovie: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddMovieRequest>({
    title: '',
    genre: '',
    durationMinutes: 0,
    releaseDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const movie = await movieService.getMovieById(parseInt(movieId!));
      setFormData({
        title: movie.title,
        genre: movie.genre,
        durationMinutes: movie.durationMinutes,
        releaseDate: movie.releaseDate,
      });
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch movie';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.genre || formData.durationMinutes <= 0 || !formData.releaseDate) {
      setError('Please fill in all fields with valid values');
      return;
    }

    setSubmitting(true);

    try {
      await movieService.updateMovie(parseInt(movieId!), formData);
      setSuccess('Movie updated successfully!');
      setTimeout(() => navigate('/movies'), 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update movie';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (submitting) {
    return <LoadingSpinner message="Updating movie..." />;
  }

  return (
    <div className="add-movie-container">
      <div className="add-movie-card">
        <h1>Edit Movie</h1>

        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Movie Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter movie title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              id="genre"
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter genre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="durationMinutes">Duration (minutes)</label>
            <input
              id="durationMinutes"
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              placeholder="Enter duration in minutes"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              id="releaseDate"
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Update Movie
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/movies')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;

