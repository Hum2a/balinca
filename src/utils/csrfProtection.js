/**
 * CSRF Protection Utility
 * 
 * Provides utilities for protecting against Cross-Site Request Forgery attacks
 */

// Generate a random token
const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto API if available for better randomness
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      token += chars[values[i] % chars.length];
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return token;
};

// CSRF token storage key
const CSRF_TOKEN_KEY = 'app_csrf_token';

/**
 * Get the current CSRF token or generate a new one
 * @returns {string} - CSRF token
 */
export const getCsrfToken = () => {
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  
  if (!token) {
    token = generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  
  return token;
};

/**
 * Add a CSRF token to a form element
 * @param {HTMLElement} formElement - The form to protect
 */
export const protectForm = (formElement) => {
  if (!formElement || !(formElement instanceof HTMLElement)) {
    console.error('Invalid form element provided to protectForm');
    return;
  }
  
  // Get or create the token
  const token = getCsrfToken();
  
  // Create a hidden input field for the token
  let tokenInput = formElement.querySelector('input[name="_csrf"]');
  
  if (!tokenInput) {
    tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = '_csrf';
    formElement.appendChild(tokenInput);
  }
  
  // Set the token value
  tokenInput.value = token;
};

/**
 * Validate a CSRF token from a request
 * @param {string} token - The token to validate
 * @returns {boolean} - Whether the token is valid
 */
export const validateCsrfToken = (token) => {
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return storedToken && token === storedToken;
};

/**
 * Add CSRF protection headers to fetch requests
 * @param {Object} options - Fetch options object
 * @returns {Object} - Updated options with CSRF headers
 */
export const addCsrfHeaders = (options = {}) => {
  const token = getCsrfToken();
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': token
    },
    credentials: 'same-origin' // Always include cookies for CSRF protection
  };
};

/**
 * React hook for CSRF protection in forms
 * @returns {Object} - CSRF protection utilities for React components
 */
export const useCsrfProtection = () => {
  const token = getCsrfToken();
  
  // Return functions and values for React components
  return {
    csrfToken: token,
    getCsrfFormField: () => (
      <input type="hidden" name="_csrf" value={token} />
    ),
    addCsrfToData: (data) => ({
      ...data,
      _csrf: token
    }),
    validateToken: validateCsrfToken
  };
};

// Automatically refresh token periodically for enhanced security
const refreshTokenPeriodically = () => {
  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  
  setInterval(() => {
    const newToken = generateToken();
    sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
  }, REFRESH_INTERVAL);
};

// Initialize token refresh
refreshTokenPeriodically(); 