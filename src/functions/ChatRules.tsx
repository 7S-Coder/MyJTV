import emojiRegex from 'emoji-regex';

export const validateMessage = (message: string, forbiddenWords: string[]) => {
  const uppercasePattern = /[A-Z]{11,}/; // Modifie le pattern pour détecter plus de 10 majuscules consécutives
  const repeatedLettersPattern = /(.)\1{3,}/;
  const regex = emojiRegex();

  // Vérifie la longueur maximale du message
  if (message.length > 150) {
    return { isValid: false, placeholder: 'Pas de pavés stp' };
  }

  // Vérifie la présence excessive d'émojis
  const emojiMatches = message.match(regex);
  if (emojiMatches && emojiMatches.length > 6) {
    return { isValid: false, placeholder: 'Doucement sur les émojis)' };
  }

  // Nettoie le message en supprimant les mentions
  const sanitizedMessage = message.replace(/@\w+/g, '').trim();

  // Vérifie la présence de mots interdits, de majuscules excessives ou de lettres répétées
  if (
    forbiddenWords.some((word) => sanitizedMessage.toLowerCase().includes(word)) ||
    uppercasePattern.test(sanitizedMessage) || // Vérifie plus de 10 majuscules consécutives
    repeatedLettersPattern.test(sanitizedMessage)
  ) {
    return { isValid: false, placeholder: 'Message non autorisé' };
  }

  return { isValid: true, placeholder: '' };
};
