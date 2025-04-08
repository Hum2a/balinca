/**
 * Security Logging Service
 * 
 * Records security-related events for monitoring and auditing purposes
 */

import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/initFirebase';
import { analyticsEvents } from '../firebase/initFirebase';

// Log levels
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  ALERT: 'alert'
};

// Security event types
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  PASSWORD_RESET_COMPLETE: 'password_reset_complete',
  PROFILE_UPDATE: 'profile_update',
  ACCOUNT_CREATION: 'account_creation',
  ACCOUNT_DELETION: 'account_deletion',
  PERMISSION_CHANGE: 'permission_change',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  API_ACCESS: 'api_access',
  DATA_EXPORT: 'data_export'
};

/**
 * Log a security event to Firestore with anonymized data
 * 
 * @param {string} eventType - Type of security event from SECURITY_EVENTS
 * @param {string} level - Log level from LOG_LEVELS
 * @param {Object} details - Event details (will be sanitized)
 * @returns {Promise<void>}
 */
export const logSecurityEvent = async (eventType, level = LOG_LEVELS.INFO, details = {}) => {
  try {
    // Get current user if available
    const currentUser = auth.currentUser;
    
    // Sanitize sensitive data from details
    const sanitizedDetails = sanitizeLogDetails(details);
    
    // Prepare event data
    const eventData = {
      eventType,
      level,
      timestamp: serverTimestamp(),
      userId: currentUser ? currentUser.uid : null,
      userEmail: currentUser ? maskEmail(currentUser.email) : null,
      ipAddress: await getClientIpAddress(),
      userAgent: navigator.userAgent,
      details: sanitizedDetails
    };
    
    // Log to Firestore security_logs collection
    await addDoc(collection(db, 'security_logs'), eventData);
    
    // Also log to console during development
    if (process.env.NODE_ENV === 'development') {
      console.group(`Security Event: ${eventType}`);
      console.log('Level:', level);
      console.log('Details:', sanitizedDetails);
      console.log('User:', currentUser ? currentUser.uid : 'Unauthenticated');
      console.groupEnd();
    }
    
    // For high severity events, trigger an alert
    if (level === LOG_LEVELS.ALERT) {
      triggerSecurityAlert(eventType, eventData);
    }
    
  } catch (error) {
    // Fail silently in production, but log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logging security event:', error);
    }
  }
};

/**
 * Sanitize log details to remove sensitive data
 * 
 * @param {Object} details - Original details object
 * @returns {Object} - Sanitized details
 */
const sanitizeLogDetails = (details) => {
  if (!details || typeof details !== 'object') {
    return {};
  }
  
  const sanitized = { ...details };
  
  // List of fields to mask or remove
  const sensitiveFields = [
    'password', 'oldPassword', 'newPassword', 'token', 'secret', 
    'creditCard', 'ssn', 'socialSecurity', 'dob', 'birthdate', 
    'address', 'phoneNumber', 'mfa', 'authCode'
  ];
  
  // Replace sensitive data with [REDACTED]
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  // Check for nested objects
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogDetails(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Mask an email address for logging
 * Shows first character and domain only, e.g. j***@example.com
 * 
 * @param {string} email - Email address to mask
 * @returns {string} - Masked email
 */
const maskEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const [localPart, domain] = email.split('@');
  
  if (!domain) {
    return email.charAt(0) + '***';
  }
  
  return localPart.charAt(0) + '***@' + domain;
};

/**
 * Get the client's IP address for logging
 * 
 * @returns {Promise<string>} - Client IP or 'unknown'
 */
const getClientIpAddress = async () => {
  try {
    // Since client-side JS can't reliably get the IP address directly,
    // we can use a service like ipify or implement our own endpoint
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Trigger a security alert for high severity events
 * 
 * @param {string} eventType - Type of security event
 * @param {Object} eventData - Event data
 */
const triggerSecurityAlert = (eventType, eventData) => {
  // In a real implementation, this could:
  // 1. Send an email to the security team
  // 2. Create an incident in a security system
  // 3. Send a push notification to admins
  // 4. Block the user account temporarily
  
  console.warn('SECURITY ALERT:', eventType, eventData);
  
  // Log to analytics for tracking
  if (analyticsEvents) {
    // Use Firebase Analytics to track security alerts
    analyticsEvents.ERROR_OCCURRED('security_alert', {
      eventType,
      level: eventData.level,
      timestamp: new Date().toISOString()
    });
  }
}; 