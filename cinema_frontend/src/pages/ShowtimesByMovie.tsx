import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Showtime } from '../types';
import { showtimeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/ShowtimeList.css';

const ShowtimesByMovie: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (movieId) {
      fetchShowtimes();
    }
  }, [movieId]);

  const fetchShowtimes = async () => {
    try {
      setLoading(true);
      const data = await showtimeService.getShowtimesByMovie(parseInt(movieId!));
      setShowtimes(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch showtimes');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleDeleteShowtime = async (showtimeId: number) => {
    if (!window.confirm('Are you sure you want to delete this showtime? This action cannot be undone.')) {
      return;
    }
    try {
      setDeleting(showtimeId);
      await showtimeService.deleteShowtime(showtimeId);
      setSuccess('Showtime deleted successfully!');
      setTimeout(() => {
        fetchShowtimes();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete showtime';
      setError(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditShowtime = (showtimeId: number) => {
    navigate(`/edit-showtime/${showtimeId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading showtimes..." />;
  }

  return (
    <div className="showtime-list-container">
      <h1>Showtimes for Movie</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} />}

      {showtimes.length === 0 ? (
        <p className="no-data">No showtimes available for this movie</p>
      ) : (
        <div className="showtimes-table">
          <table>
            <thead>
              <tr>
                <th>Hall</th>
                <th>Start Time</th>
                <th>Action</th>
                {user?.role === 'ADMIN' && <th>Admin Actions</th>}
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime.id}>
                  <td>{showtime.hall?.name || 'N/A'}</td>
                  <td>{formatDateTime(showtime.startTime)}</td>
                  <td>
                    <Link to={`/booking/${showtime.id}`} className="btn-primary">
                      Book Ticket
                    </Link>
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="admin-actions">
                      <button className="btn-secondary" onClick={() => handleEditShowtime(showtime.id!)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteShowtime(showtime.id!)} disabled={deleting === showtime.id}>
                        {deleting === showtime.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowtimesByMovie;

