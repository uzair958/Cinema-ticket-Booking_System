import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Seat, Showtime } from '../types';
import { seatService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/BookingForm.css';

const BookingForm: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSeats();
  }, [showtimeId, user, navigate]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      // Note: We need hallId from showtime, but it's not directly available
      // This is a limitation - we'll need to fetch showtime details first
      // For now, we'll assume hallId is passed or available
      // In a real scenario, you'd fetch the showtime first to get hallId
      setError('');
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

    if (!selectedSeat || !user?.id) {
      setError('Please select a seat');
      return;
    }

    if (price <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setSubmitting(true);

    try {
      await bookingService.bookSeat({
        userId: user.id,
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

