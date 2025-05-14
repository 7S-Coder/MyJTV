import emojiRegex from 'emoji-regex';

export const validateMessage = (message: string, forbiddenWords: string[]) => {
  const uppercasePattern = /[A-Z]{3,}/;
  const repeatedLettersPattern = /(.)\1{3,}/;
  const regex = emojiRegex();

  
  // Check for excessive emojis
  const emojiMatches = message.match(regex);
  if (emojiMatches && emojiMatches.length > 6) {
    return { isValid: false, placeholder: 'Doucement sur les émojis)' };
  }

  // Sanitize message by removing mentions
  const sanitizedMessage = message.replace(/@\w+/g, '').trim();

  // Check for forbidden words, excessive uppercase, or repeated letters
  if (
    forbiddenWords.some((word) => sanitizedMessage.toLowerCase().includes(word)) ||
    uppercasePattern.test(sanitizedMessage) ||
    repeatedLettersPattern.test(sanitizedMessage)
  ) {
    return { isValid: false, placeholder: 'Message non autorisé' };
  }

  return { isValid: true, placeholder: '' };
};
