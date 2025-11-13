import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hall, Seat } from '../types';
import { hallService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/HallList.css';

const HallList: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [hallSeats, setHallSeats] = useState<Seat[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(false);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const data = await hallService.getAllHalls();
      setHalls(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch halls');
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

  if (loading) {
    return <LoadingSpinner message="Loading halls..." />;
  }

  return (
    <div className="hall-list-container">
      <h1>Cinema Halls</h1>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

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

