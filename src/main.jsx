import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.jsx';
import ConfirmationMessageContext from './contexts/ConfirmationMessageContext'; // Import the context

const Root = () => {
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        document.querySelector('.box')?.style.setProperty('height', `${window.innerHeight}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (confirmationMessage) {
      const timeout = setTimeout(() => {
        setConfirmationMessage(null); // Automatically close the message after 2ms
      }, 2000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount or state change
    }
  }, [confirmationMessage]);

  return (
    <ConfirmationMessageContext.Provider value={{ message: confirmationMessage, setMessage: setConfirmationMessage }}>
      <App />
      {/* Affiche le message de confirmation */}
      {confirmationMessage && (
        <div className="confirmation-message">
          {confirmationMessage}
        </div>
      )}
    </ConfirmationMessageContext.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);