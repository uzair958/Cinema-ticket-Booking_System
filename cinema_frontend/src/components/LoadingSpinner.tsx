import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;

