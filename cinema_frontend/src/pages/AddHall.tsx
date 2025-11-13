import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddHallRequest } from '../types';
import { hallService } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

const AddHall: React.FC = () => {
  const [formData, setFormData] = useState<AddHallRequest>({
    name: '',
    totalSeats: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalSeats' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.name || !formData.totalSeats) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.totalSeats < 1) {
        setError('Total seats must be at least 1');
        return;
      }

      await hallService.addHall(formData);
      setSuccess('Hall added successfully!');
      setTimeout(() => navigate('/halls'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add hall');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Adding hall..." />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Add New Hall</h1>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        {success && <SuccessMessage message={success} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Hall Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Hall 1, IMAX Hall"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalSeats">Total Seats</label>
            <input
              id="totalSeats"
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              placeholder="Enter total number of seats"
              min="1"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Hall
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHall;

