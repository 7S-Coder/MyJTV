import React, { createContext, useState } from 'react';

export const StreamContext = createContext();

export const StreamProvider = ({ children }) => {
  const [stream, setStream] = useState(null);

  return (
    <StreamContext.Provider value={{ stream, setStream }}>
      {children}
    </StreamContext.Provider>
  );
};
