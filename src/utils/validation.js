/**
 * Input validation utilities to prevent injection attacks and validate form data
 */

/**
 * Sanitizes text input to prevent XSS attacks
 * @param {string} input - User input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Replace HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email.toLowerCase());
};

/**
 * Validates phone numbers
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Basic phone validation (numbers, spaces, dashes, parentheses, plus sign)
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
    phone.trim()
  );
};

/**
 * Validates that an input contains only alphanumeric characters and specific allowed symbols
 * @param {string} input - String to validate
 * @param {string} allowedChars - Additional allowed characters (optional)
 * @returns {boolean} - Whether the input is valid
 */
export const isAlphanumeric = (input, allowedChars = '') => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  const regex = new RegExp(`^[a-zA-Z0-9${allowedChars.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]+$`);
  return regex.test(input);
};

/**
 * Validates a strong password
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid flag and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

/**
 * Checks for common SQL injection patterns
 * @param {string} input - User input to check
 * @returns {boolean} - Whether the input contains potential SQL injection
 */
export const hasSqlInjection = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  const sqlPatterns = [
    /(\b|')SELECT(\b|')/i,
    /(\b|')INSERT(\b|')/i,
    /(\b|')UPDATE(\b|')/i,
    /(\b|')DELETE(\b|')/i,
    /(\b|')DROP(\b|')/i,
    /(\b|')UNION(\b|')/i,
    /(\b|');/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Checks for common NoSQL injection patterns
 * @param {string} input - User input to check
 * @returns {boolean} - Whether the input contains potential NoSQL injection
 */
export const hasNoSqlInjection = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Check for MongoDB operators in unexpected places
  const noSqlPatterns = [
    /\$where\s*:/i,
    /\$regex\s*:/i,
    /\$gt\s*:/i,
    /\$lt\s*:/i,
    /\$gte\s*:/i,
    /\$lte\s*:/i,
    /\$in\s*:/i,
    /\$nin\s*:/i,
    /\$all\s*:/i,
    /\$and\s*:/i,
    /\$or\s*:/i
  ];
  
  return noSqlPatterns.some(pattern => pattern.test(input));
}; 