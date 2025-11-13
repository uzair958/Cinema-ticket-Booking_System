import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { movieService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/MovieList.css';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAllMovies();
      setMovies(data);
      setError('');
    } catch (err) {
      let errorMessage = 'Failed to fetch movies';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        }
      }

      setError(errorMessage);
      console.error('Fetch movies error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchMovies();
      return;
    }

    try {
      setLoading(true);
      const data = await movieService.searchMovies(searchTerm);
      setMovies(data);
      setError('');
    } catch (err) {
      let errorMessage = 'Search failed';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        } else if (errorMessage.includes('404')) {
          errorMessage = 'No movies found matching your search.';
        }
      }

      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading movies..." />;
  }

  return (
    <div className="movie-list-container">
      <h1>Movies</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setSearchTerm('');
            fetchMovies();
          }}
        >
          Clear
        </button>
      </form>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
          type={error.includes('session') ? 'auth' : 'error'}
          dismissible={true}
        />
      )}

      {movies.length === 0 ? (
        <p className="no-data">No movies found</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Duration:</strong> {movie.durationMinutes} minutes</p>
              <p><strong>Release Date:</strong> {movie.releaseDate}</p>
              <Link to={`/showtimes/${movie.id}`} className="btn-primary">
                View Showtimes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;

