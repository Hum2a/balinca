/**
 * Secure API service for handling external API requests
 * Implements proper error handling, request timeouts, and security measures
 */

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 15000;

/**
 * Makes a secure API request with timeout and error handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options including method, headers, body
 * @param {number} timeout - Request timeout in milliseconds (default: 15000)
 * @returns {Promise<any>} - API response data
 */
export const secureApiRequest = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  try {
    // Create an abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Add security headers and abort signal to options
    const secureOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      signal: controller.signal,
      credentials: 'same-origin', // Include cookies for same-origin requests
      mode: 'cors', // Enable CORS if needed
      cache: 'no-cache', // Disable caching for sensitive data
      referrerPolicy: 'strict-origin-when-cross-origin' // Limit referrer information
    };
    
    // Make the request
    const response = await fetch(url, secureOptions);
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Check if request was successful
    if (!response.ok) {
      // Handle different types of error responses
      switch (response.status) {
        case 401:
          throw new Error('Unauthorized: Please log in to access this resource');
        case 403:
          throw new Error('Forbidden: You do not have permission to access this resource');
        case 404:
          throw new Error('Resource not found');
        case 429:
          throw new Error('Too many requests: Please try again later');
        case 500:
        case 502:
        case 503:
        case 504:
          throw new Error('Server error: Please try again later');
        default:
          throw new Error(`API request failed with status: ${response.status}`);
      }
    }
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else if (contentType?.includes('text/')) {
      return await response.text();
    } else {
      return await response.blob();
    }
  } catch (error) {
    // Handle request timeout
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond');
    }
    
    // Log error for debugging (in production, would send to monitoring service)
    console.error('API request failed:', error);
    
    // Re-throw the error for the caller to handle
    throw error;
  }
};

/**
 * Makes a secure GET request
 * @param {string} url - The API endpoint URL
 * @param {Object} headers - Additional headers to include
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<any>} - API response data
 */
export const secureGet = (url, headers = {}, timeout = DEFAULT_TIMEOUT) => {
  return secureApiRequest(url, { method: 'GET', headers }, timeout);
};

/**
 * Makes a secure POST request
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The data to send
 * @param {Object} headers - Additional headers to include
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<any>} - API response data
 */
export const securePost = (url, data, headers = {}, timeout = DEFAULT_TIMEOUT) => {
  return secureApiRequest(
    url, 
    { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(data)
    }, 
    timeout
  );
};

/**
 * Makes an API request with authentication (for Firebase/authenticated endpoints)
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string} authToken - Authentication token
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<any>} - API response data
 */
export const authenticatedRequest = async (url, options = {}, authToken, timeout = DEFAULT_TIMEOUT) => {
  if (!authToken) {
    throw new Error('Authentication token is required');
  }
  
  const authHeaders = {
    ...options.headers,
    'Authorization': `Bearer ${authToken}`
  };
  
  return secureApiRequest(url, { ...options, headers: authHeaders }, timeout);
};

/**
 * Makes a secure request to external APIs with rate limiting awareness
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string} apiKey - API key for the external service
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<any>} - API response data
 */
export const externalApiRequest = async (url, options = {}, apiKey = null, timeout = DEFAULT_TIMEOUT) => {
  // Add API key to headers or query parameters as required
  let secureUrl = url;
  
  if (apiKey) {
    // URL with API key as query parameter
    const separator = url.includes('?') ? '&' : '?';
    secureUrl = `${url}${separator}apiKey=${apiKey}`;
  }
  
  try {
    return await secureApiRequest(secureUrl, options, timeout);
  } catch (error) {
    // Handle rate limiting
    if (error.message.includes('429') || error.message.includes('Too many requests')) {
      console.warn('Rate limit reached for external API, will retry after delay');
      
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Retry the request
      return secureApiRequest(secureUrl, options, timeout);
    }
    
    throw error;
  }
}; 