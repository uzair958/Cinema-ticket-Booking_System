import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Showtime } from '../types';
import { showtimeService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ShowtimeList.css';

const ShowtimesByMovie: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <LoadingSpinner message="Loading showtimes..." />;
  }

  return (
    <div className="showtime-list-container">
      <h1>Showtimes for Movie</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

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

