import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { movieService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/MovieList.css';

const MovieList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching movies...');
      const data = await movieService.getAllMovies();
      console.log('✅ Movies fetched:', data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setMovies(data);
        setError('');
      } else {
        console.error('❌ Invalid movies data:', data);
        setError('Invalid response format from server');
        setMovies([]);
      }
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
      setMovies([]);
      console.error('❌ Fetch movies error:', err);
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

  const handleDeleteMovie = async (movieId: number) => {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return;
    }
    try {
      setDeleting(movieId);
      await movieService.deleteMovie(movieId);
      setSuccess('Movie deleted successfully!');
      setTimeout(() => {
        fetchMovies();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete movie';
      setError(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditMovie = (movieId: number) => {
    navigate(`/edit-movie/${movieId}`);
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
      {success && <SuccessMessage message={success} />}

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
              <div className="movie-actions">
                <Link to={`/showtimes/${movie.id}`} className="btn-primary">
                  View Showtimes
                </Link>
                {user?.role === 'ADMIN' && (
                  <div className="admin-actions">
                    <button className="btn-secondary" onClick={() => handleEditMovie(movie.id!)}>
                      ✏️ Edit
                    </button>
                    <button className="btn-danger" onClick={() => handleDeleteMovie(movie.id!)} disabled={deleting === movie.id}>
                      {deleting === movie.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;

