import { createContext, useContext } from 'react';

// Contexte pour le message de confirmation
const ConfirmationMessageContext = createContext({
  message: null,
  setMessage: (p0) => {}, // Default implementation
});

export const useConfirmationMessage = () => useContext(ConfirmationMessageContext);

export default ConfirmationMessageContext;
