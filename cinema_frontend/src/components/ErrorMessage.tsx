import React, { useEffect, useState } from 'react';
import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info' | 'auth';
  duration?: number;
  dismissible?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  type = 'error',
  duration,
  dismissible = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'auth':
        return '🔐';
      case 'error':
      default:
        return '❌';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className={`error-message error-${type}`}>
      <div className="error-content">
        <span className="error-icon">{getIcon()}</span>
        <div className="error-text">
          <p className="error-message-text">{message}</p>
        </div>
        {dismissible && (
          <button
            className="error-close"
            onClick={handleClose}
            aria-label="Close error message"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

