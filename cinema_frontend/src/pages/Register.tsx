import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'USER',
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Extract meaningful error message
      let errorMessage = 'Registration failed. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
          errorMessage = 'This email is already registered. Please use a different email or login.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating account..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            type={error.includes('already registered') ? 'warning' : 'error'}
            dismissible={true}
          />
        )}
        {success && <SuccessMessage message={success} />}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

