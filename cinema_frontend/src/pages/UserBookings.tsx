import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/UserBookings.css';

const UserBookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings(user!.id!);
      setBookings(data);
      setError('');
    } catch (err) {
      let errorMessage = 'Failed to fetch bookings';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <div className="user-bookings-container">
      <h1>My Bookings</h1>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
          type={error.includes('session') ? 'auth' : 'error'}
          dismissible={true}
        />
      )}

      {bookings.length === 0 ? (
        <p className="no-data">You have no bookings yet</p>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Hall</th>
                <th>Seat</th>
                <th>Showtime</th>
                <th>Booking Time</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.showtime?.movie?.title || 'N/A'}</td>
                  <td>{booking.showtime?.hall?.name || 'N/A'}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{formatDateTime(booking.showtime?.startTime)}</td>
                  <td>{formatDateTime(booking.bookingTime)}</td>
                  <td>${booking.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserBookings;

