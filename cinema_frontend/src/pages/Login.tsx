import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      await login(email, password);
      navigate('/');
    } catch (err) {
      // Extract meaningful error message
      let errorMessage = 'Login failed. Please try again.';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Provide specific guidance for common errors
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        }
      }

      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Logging in..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
            type={error.includes('Invalid') ? 'warning' : 'error'}
            dismissible={true}
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

