import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddMovieRequest } from '../types';
import { movieService } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

const AddMovie: React.FC = () => {
  const [formData, setFormData] = useState<AddMovieRequest>({
    title: '',
    genre: '',
    durationMinutes: 0,
    releaseDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.title || !formData.genre || !formData.durationMinutes || !formData.releaseDate) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      await movieService.addMovie(formData);
      setSuccess('Movie added successfully!');
      setTimeout(() => navigate('/movies'), 2000);
    } catch (err) {
      let errorMessage = 'Failed to add movie';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        } else if (errorMessage.includes('403') || errorMessage.includes('Access Denied')) {
          errorMessage = 'You do not have permission to add movies. Admin access required.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Add movie error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Adding movie..." />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Add New Movie</h1>
        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            type={error.includes('session') ? 'auth' : error.includes('permission') ? 'warning' : 'error'}
            dismissible={true}
          />
        )}
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
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select a genre</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Animation">Animation</option>
            </select>
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
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;

