import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seat, Showtime, User } from '../types';
import { seatService, bookingService, showtimeService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/BookingForm.css';

const BookingForm: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userSearchEmail, setUserSearchEmail] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSeats();

    // If admin, fetch all users
    if (user.role === 'ADMIN') {
      fetchAllUsers();
    } else {
      // If regular user, set their ID as selected
      setSelectedUserId(user.id);
    }
  }, [showtimeId, user, navigate]);

  const fetchAllUsers = async () => {
    try {
      console.log('👥 Fetching all users for admin booking');
      const users = await userService.getAllUsers();
      console.log('✅ Users fetched:', users);
      setAllUsers(users);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
      // Don't show error, just continue without user selection
    }
  };

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Fetch showtime details to get hallId
      console.log('🔄 Fetching showtime details for ID:', showtimeId);
      const showtimeData = await showtimeService.getShowtimeById(parseInt(showtimeId!));
      console.log('✅ Showtime fetched:', showtimeData);
      setShowtime(showtimeData);

      // Step 2: Fetch seats for the hall
      if (showtimeData.hall && showtimeData.hall.id) {
        console.log('🔄 Fetching seats for hall ID:', showtimeData.hall.id);
        const seatsData = await seatService.getAvailableSeats(showtimeData.hall.id);
        console.log('✅ Seats fetched:', seatsData);
        setSeats(seatsData);
      } else {
        throw new Error('Hall information not available in showtime');
      }
    } catch (err) {
      let errorMessage = 'Failed to fetch seats';

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
      console.error('Fetch seats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.available) {
      setSelectedSeat(seat);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSeat) {
      setError('Please select a seat');
      return;
    }

    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    if (price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setSubmitting(true);

    try {
      await bookingService.bookSeat({
        userId: selectedUserId,
        showtimeId: parseInt(showtimeId!),
        seatNumber: selectedSeat.seatNumber,
        price,
      });

      setSuccess('Booking successful!');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      let errorMessage = 'Booking failed';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        } else if (errorMessage.includes('already booked')) {
          errorMessage = 'This seat has already been booked. Please select another seat.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading seats..." />;
  }

  if (submitting) {
    return <LoadingSpinner message="Processing booking..." />;
  }

  return (
    <div className="booking-form-container">
      <div className="booking-card">
        <h1>Book Your Ticket</h1>

        {showtime && (
          <div className="showtime-info">
            <p><strong>Movie:</strong> {showtime.movie?.title || 'N/A'}</p>
            <p><strong>Hall:</strong> {showtime.hall?.name || 'N/A'}</p>
            <p><strong>Time:</strong> {new Date(showtime.startTime).toLocaleString()}</p>
          </div>
        )}

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            type={error.includes('session') ? 'auth' : error.includes('already') ? 'warning' : 'error'}
            dismissible={true}
          />
        )}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit}>
          {user?.role === 'ADMIN' && (
            <div className="form-group">
              <label htmlFor="user-select">Book for User (Email)</label>
              <div className="user-selector">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={userSearchEmail}
                  onChange={(e) => setUserSearchEmail(e.target.value)}
                  className="user-search-input"
                />
                <select
                  id="user-select"
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                  required
                >
                  <option value="">-- Select a User --</option>
                  {allUsers
                    .filter((u) => userSearchEmail === '' || u.email.toLowerCase().includes(userSearchEmail.toLowerCase()))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email} ({u.name || 'No name'})
                      </option>
                    ))}
                </select>
              </div>
              {selectedUserId && (
                <p className="selected-user-info">
                  ✓ Booking for: <strong>{allUsers.find((u) => u.id === selectedUserId)?.email}</strong>
                </p>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Select a Seat</label>
            <div className="seats-selection">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  className={`seat-button ${
                    !seat.available ? 'booked' : selectedSeat?.id === seat.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatSelect(seat)}
                  disabled={!seat.available}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          </div>

          {selectedSeat && (
            <div className="selected-seat-info">
              <p>Selected Seat: <strong>{selectedSeat.seatNumber}</strong></p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Enter ticket price"
              step="0.01"
              min="0"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={!selectedSeat}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;

