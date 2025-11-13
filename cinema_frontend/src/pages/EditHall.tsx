import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Hall, AddHallRequest } from '../types';
import { hallService } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

const EditHall: React.FC = () => {
  const { hallId } = useParams<{ hallId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddHallRequest>({
    name: '',
    totalSeats: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hallId) {
      fetchHall();
    }
  }, [hallId]);

  const fetchHall = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching hall:', hallId);
      const hall = await hallService.getHallById(parseInt(hallId!));
      console.log('✅ Hall fetched:', hall);
      setFormData({
        name: hall.name,
        totalSeats: hall.totalSeats,
      });
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch hall';
      console.error('❌ Fetch hall error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitting(true);

    try {
      if (!formData.name || !formData.totalSeats) {
        setError('Please fill in all fields');
        setSubmitting(false);
        return;
      }

      if (formData.totalSeats < 1) {
        setError('Total seats must be at least 1');
        setSubmitting(false);
        return;
      }

      console.log('📤 Updating hall:', hallId, formData);
      await hallService.updateHall(parseInt(hallId!), formData);
      setSuccess('Hall updated successfully!');
      setTimeout(() => navigate('/halls'), 2000);
    } catch (err) {
      let errorMessage = 'Failed to update hall';

      if (err instanceof Error) {
        errorMessage = err.message;

        if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Your session has expired. Please login again.';
        } else if (errorMessage.includes('403') || errorMessage.includes('Access Denied')) {
          errorMessage = 'You do not have permission to edit halls. Admin access required.';
        }
      }

      console.error('❌ Update hall error:', err);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading hall..." />;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Edit Hall</h1>
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

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Hall'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/halls')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHall;

