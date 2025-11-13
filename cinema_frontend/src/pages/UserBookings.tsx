import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../types';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/UserBookings.css';

const UserBookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

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
      let data;

      // Admins see all bookings, users see only their own
      if (user?.role === 'ADMIN') {
        console.log('👨‍💼 Fetching all bookings (Admin)');
        data = await bookingService.getAllBookings();
      } else {
        console.log('👤 Fetching user bookings');
        data = await bookingService.getUserBookings(user!.id!);
      }

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

  const handleDeleteBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      setDeleting(bookingId);
      console.log('🗑️ Deleting booking:', bookingId);
      await bookingService.deleteBooking(bookingId);
      setSuccess('Booking deleted successfully!');
      setError('');

      // Refresh bookings
      setTimeout(() => {
        fetchBookings();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete booking';
      console.error('❌ Delete booking error:', errorMsg);
      setError(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditPrice = async (bookingId: number) => {
    if (editPrice <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      console.log('📤 Updating booking price:', bookingId, editPrice);
      await bookingService.updateBooking(bookingId, { price: editPrice });
      setSuccess('Booking updated successfully!');
      setError('');
      setEditingId(null);

      // Refresh bookings
      setTimeout(() => {
        fetchBookings();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update booking';
      console.error('❌ Update booking error:', errorMsg);
      setError(errorMsg);
    }
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner message={user?.role === 'ADMIN' ? 'Loading all bookings...' : 'Loading your bookings...'} />;
  }

  const isAdmin = user?.role === 'ADMIN';
  const title = isAdmin ? 'All Bookings' : 'My Bookings';
  const emptyMessage = isAdmin ? 'No bookings found' : 'You have no bookings yet';

  return (
    <div className="user-bookings-container">
      <h1>{title}</h1>

      {error && (
        <ErrorMessage
          message={error}
          onClose={() => setError('')}
          type={error.includes('session') ? 'auth' : 'error'}
          dismissible={true}
        />
      )}
      {success && <SuccessMessage message={success} />}

      {bookings.length === 0 ? (
        <p className="no-data">{emptyMessage}</p>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>User</th>}
                <th>Movie</th>
                <th>Hall</th>
                <th>Seat</th>
                <th>Showtime</th>
                <th>Booking Time</th>
                <th>Price</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  {isAdmin && <td>{booking.user?.email || 'N/A'}</td>}
                  <td>{booking.showtime?.movie?.title || 'N/A'}</td>
                  <td>{booking.showtime?.hall?.name || 'N/A'}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{formatDateTime(booking.showtime?.startTime)}</td>
                  <td>{formatDateTime(booking.bookingTime)}</td>
                  <td>
                    {editingId === booking.id ? (
                      <div className="edit-price">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                          step="0.01"
                          min="0"
                        />
                        <button
                          className="btn-save"
                          onClick={() => handleEditPrice(booking.id!)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span>${booking.price.toFixed(2)}</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="admin-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingId(booking.id!);
                          setEditPrice(booking.price);
                        }}
                        disabled={deleting === booking.id}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBooking(booking.id!)}
                        disabled={deleting === booking.id}
                      >
                        {deleting === booking.id ? '🗑️ Deleting...' : '🗑️ Delete'}
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

export default UserBookings;

