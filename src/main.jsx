import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.jsx';

const Root = () => {
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

  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);