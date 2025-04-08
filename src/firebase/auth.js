import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './initFirebase';
import { logSecurityEvent, SECURITY_EVENTS, LOG_LEVELS } from '../utils/securityLogger';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

// Rate limiting variables
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Custom hook for authentication
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "No user");
      setCurrentUser(user);
      setLoading(false);
      
      // Set up session timeout for security
      if (user) {
        setupSessionTimeout(user);
      }
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error);
      setLoading(false);
      
      // Log authentication errors
      logSecurityEvent(
        SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
        LOG_LEVELS.WARNING,
        { message: 'Auth state change error', errorCode: error.code }
      );
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);
  
  // Setup session timeout
  const setupSessionTimeout = (user) => {
    // Set a session timeout of 30 minutes (adjust as needed)
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    // Store the session start time
    updateDoc(doc(db, "users", user.uid), {
      lastActive: serverTimestamp()
    }).catch(err => console.error("Error updating last active time:", err));
    
    // Check session every minute
    const interval = setInterval(async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const lastActive = userDoc.data().lastActive?.toDate();
          if (lastActive && (new Date() - lastActive > SESSION_TIMEOUT)) {
            // Session expired, log out the user
            console.log("Session expired, logging out");
            clearInterval(interval);
            logout();
          } else {
            // Update the last active time
            updateDoc(doc(db, "users", user.uid), {
              lastActive: serverTimestamp()
            });
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  };

  // Sign in with email and password with rate limiting
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Check if account is locked due to too many attempts
      const loginAttemptsRef = doc(db, "loginAttempts", email.toLowerCase());
      const loginAttemptsDoc = await getDoc(loginAttemptsRef);
      
      if (loginAttemptsDoc.exists()) {
        const { attempts, lockUntil } = loginAttemptsDoc.data();
        
        if (lockUntil && new Date(lockUntil) > new Date()) {
          // Account is locked
          const remainingTime = Math.ceil((new Date(lockUntil) - new Date()) / 60000);
          throw new Error(`Account is temporarily locked. Try again in ${remainingTime} minutes.`);
        }
        
        // If we're here, any previous lockout has expired
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          // Reset attempts counter after lockout period
          await setDoc(loginAttemptsRef, { attempts: 1 });
        }
      }
      
      // Attempt sign in
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Successful login, reset login attempts
        await setDoc(loginAttemptsRef, { attempts: 0 });
        
        // Log successful login
        logSecurityEvent(
          SECURITY_EVENTS.LOGIN_SUCCESS,
          LOG_LEVELS.INFO,
          { userId: userCredential.user.uid }
        );
        
        console.log("Sign in successful:", userCredential.user.email);
        return userCredential.user;
      } catch (error) {
        // Failed login, increment attempt counter
        const newAttempt = loginAttemptsDoc.exists() 
          ? loginAttemptsDoc.data().attempts + 1 
          : 1;
          
        // Check if account should be locked
        if (newAttempt >= MAX_LOGIN_ATTEMPTS) {
          const lockUntil = new Date(Date.now() + LOCKOUT_DURATION);
          await setDoc(loginAttemptsRef, { 
            attempts: newAttempt,
            lockUntil: lockUntil.toISOString()
          });
          
          // Log account lockout
          logSecurityEvent(
            SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
            LOG_LEVELS.WARNING,
            { 
              email: email.toLowerCase(),
              reason: 'Too many failed login attempts',
              lockDuration: `${LOCKOUT_DURATION/60000} minutes`
            }
          );
          
          throw new Error(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION/60000} minutes.`);
        } else {
          await setDoc(loginAttemptsRef, { attempts: newAttempt });
          
          // Log failed login attempt
          logSecurityEvent(
            SECURITY_EVENTS.LOGIN_FAILURE,
            LOG_LEVELS.WARNING,
            { 
              email: email.toLowerCase(),
              errorCode: error.code,
              attemptNumber: newAttempt
            }
          );
          
          throw error;
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with email and password
  const register = async (email, password, displayName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });
      
      // Log account creation
      logSecurityEvent(
        SECURITY_EVENTS.ACCOUNT_CREATION,
        LOG_LEVELS.INFO,
        { userId: userCredential.user.uid }
      );
      
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Register error:", error);
      
      // Log registration failure
      logSecurityEvent(
        SECURITY_EVENTS.ACCOUNT_CREATION,
        LOG_LEVELS.WARNING,
        { errorCode: error.code, email: email.toLowerCase() }
      );
      
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Apple sign in error:", error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  // Sign out
  const logout = async () => {
    try {
      // Update last active time before logout
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          lastLogout: serverTimestamp()
        }).catch(err => console.error("Error updating last logout time:", err));
        
        // Log logout event
        logSecurityEvent(
          SECURITY_EVENTS.LOGOUT,
          LOG_LEVELS.INFO,
          { userId: currentUser.uid }
        );
      }
      
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
      throw error;
    }
  };

  return {
    currentUser,
    loading,
    error,
    signIn,
    register,
    signInWithGoogle,
    signInWithApple,
    logout
  };
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/account-exists-with-different-credential':
      return 'Account exists with different credentials';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled';
    default:
      return 'An error occurred during authentication';
  }
}; 