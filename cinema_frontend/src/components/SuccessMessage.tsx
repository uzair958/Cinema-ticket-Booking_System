import React, { useEffect } from 'react';
import '../styles/SuccessMessage.css';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="success-message">
      <div className="success-content">
        <span className="success-icon">✓</span>
        <p>{message}</p>
        {onClose && (
          <button className="success-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;

