import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hall, Seat } from '../types';
import { hallService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import '../styles/HallList.css';
import { useAuth } from '../context/AuthContext';

const HallList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [hallSeats, setHallSeats] = useState<Seat[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching halls...');
      const data = await hallService.getAllHalls();
      console.log('✅ Halls fetched:', data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setHalls(data);
        setError('');
      } else {
        console.error('❌ Invalid halls data:', data);
        setError('Invalid response format from server');
        setHalls([]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch halls';
      console.error('❌ Fetch halls error:', errorMsg);
      setError(errorMsg);
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSeats = async (hallId: number) => {
    try {
      setSeatsLoading(true);
      const seats = await hallService.getSeatsForHall(hallId);
      setHallSeats(seats);
      setSelectedHallId(hallId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seats');
    } finally {
      setSeatsLoading(false);
    }
  };

  const handleDeleteHall = async (hallId: number) => {
    if (!window.confirm('Are you sure you want to delete this hall? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(hallId);
      console.log('🗑️ Deleting hall:', hallId);
      await hallService.deleteHall(hallId);
      setSuccess('Hall deleted successfully!');
      setError('');

      // Refresh the halls list
      setTimeout(() => {
        fetchHalls();
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete hall';
      console.error('❌ Delete hall error:', errorMsg);
      setError(errorMsg);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditHall = (hallId: number) => {
    navigate(`/edit-hall/${hallId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading halls..." />;
  }

  return (
    <div className="hall-list-container">
      <h1>Cinema Halls</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} />}

      {halls.length === 0 ? (
        <p className="no-data">No halls available</p>
      ) : (
        <div className="halls-grid">
          {halls.map((hall) => (
            <div key={hall.id} className="hall-card">
              <h3>{hall.name}</h3>
              <p><strong>Total Seats:</strong> {hall.totalSeats}</p>
              <button
                className="btn-primary"
                onClick={() => handleViewSeats(hall.id!)}
              >
                View Seats
              </button>

              {user?.role === 'ADMIN' && (
                <div className="admin-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEditHall(hall.id!)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteHall(hall.id!)}
                    disabled={deleting === hall.id}
                  >
                    {deleting === hall.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedHallId && (
        <div className="seats-section">
          <h2>Seats for Hall {selectedHallId}</h2>
          {seatsLoading ? (
            <LoadingSpinner message="Loading seats..." />
          ) : hallSeats.length === 0 ? (
            <p className="no-data">No seats available</p>
          ) : (
            <div className="seats-grid">
              {hallSeats.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.available ? 'available' : 'booked'}`}
                  title={`Seat ${seat.seatNumber}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HallList;

