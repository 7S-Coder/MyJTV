import React from 'react';
import { createPortal } from 'react-dom';

const DropdownPortal = ({ children }) => {
  return createPortal(
    <div style={{ position: 'fixed', top: 60, right: '2vw', zIndex: 9999 }}>
      {children}
    </div>,
    document.body
  );
};

export default DropdownPortal;
