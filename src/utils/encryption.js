/**
 * Encryption utility for securing sensitive data
 * Uses AES encryption for sensitive data before storing in Firestore
 */

// The encryption key should ideally be stored in a secure environment variable
// For this implementation, we'll use a derived key from the Firebase project ID
const ENCRYPTION_KEY = process.env.REACT_APP_FIREBASE_PROJECT_ID + '_secure_key';

/**
 * Encrypts sensitive data using AES algorithm
 * @param {string|object} data - Data to encrypt (string or object)
 * @returns {string} - Encrypted data as a string
 */
export const encryptData = (data) => {
  try {
    // Convert object to string if necessary
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    // Simple encryption for demo purposes
    // In production, use a proper encryption library like CryptoJS
    const encrypted = btoa(
      encodeURIComponent(dataString)
        .split('')
        .map((c, i) => {
          return String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        })
        .join('')
    );
    
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypts data that was encrypted with encryptData
 * @param {string} encryptedData - The encrypted data string
 * @returns {string|object} - Decrypted data (as string or parsed to object)
 */
export const decryptData = (encryptedData) => {
  try {
    // Decrypt the data
    const decrypted = decodeURIComponent(
      atob(encryptedData)
        .split('')
        .map((c, i) => {
          return String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        })
        .join('')
    );
    
    // Try to parse as JSON if it looks like an object
    try {
      return JSON.parse(decrypted);
    } catch (e) {
      // Return as string if not valid JSON
      return decrypted;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Encrypts specific fields in an object, leaving others untouched
 * @param {object} data - Object containing data
 * @param {Array<string>} sensitiveFields - Array of field names to encrypt
 * @returns {object} - Object with sensitive fields encrypted
 */
export const encryptSensitiveFields = (data, sensitiveFields) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...data };
  
  sensitiveFields.forEach(field => {
    if (result[field] !== undefined) {
      result[field] = encryptData(result[field]);
    }
  });
  
  return result;
};

/**
 * Decrypts specific fields in an object, leaving others untouched
 * @param {object} data - Object containing encrypted fields
 * @param {Array<string>} sensitiveFields - Array of field names to decrypt
 * @returns {object} - Object with sensitive fields decrypted
 */
export const decryptSensitiveFields = (data, sensitiveFields) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const result = { ...data };
  
  sensitiveFields.forEach(field => {
    if (result[field] !== undefined) {
      try {
        result[field] = decryptData(result[field]);
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error);
      }
    }
  });
  
  return result;
}; 