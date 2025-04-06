// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Debug logging
console.log('Environment Variables:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
});

// Check if required environment variables are present
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_MEASUREMENT_ID'
];

// Log each environment variable's presence
requiredEnvVars.forEach(varName => {
  console.log(`${varName}: ${process.env[varName] ? 'Present' : 'Missing'}`);
});

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  throw new Error('Missing required Firebase configuration environment variables');
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Save stock data to Firestore
export const saveStockDataToFirestore = async (symbol, data) => {
  try {
    await setDoc(doc(db, "Stock Market Data", symbol), {
      data,
      lastUpdated: new Date(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving stock data to Firestore", error);
    throw error;
  }
};

// Fetch stock data from Firestore
export const fetchStockDataFromFirestore = async (symbol) => {
  try {
    const docRef = doc(db, "Stock Market Data", symbol);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching stock data from Firestore", error);
    throw error;
  }
};

// Check if today's data is already fetched
export const isDataFetchedForToday = async (symbol) => {
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchStockDataFromFirestore(symbol);
  if (data && data.lastUpdated) {
    const lastUpdated = data.lastUpdated.toDate().toISOString().split("T")[0];
    return today === lastUpdated;
  }
  return false;
};

// Analytics helper functions
const logAnalyticsEvent = (eventName, eventParams = {}) => {
  try {
    logEvent(analytics, eventName, {
      timestamp: new Date().toISOString(),
      ...eventParams
    });
    console.log('Analytics event logged:', eventName, eventParams);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

// Common analytics events
export const analyticsEvents = {
  // Auth events
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  REGISTER: 'user_register',
  
  // Feature usage
  FEATURE_VIEW: 'feature_view',
  FEATURE_INTERACTION: 'feature_interaction',
  
  // Admin events
  ADMIN_ACCESS: 'admin_access',
  ADMIN_ACTION: 'admin_action',
  
  // Error events
  ERROR_OCCURRED: 'error_occurred',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  
  // Tool usage
  TOOL_START: 'tool_start',
  TOOL_COMPLETE: 'tool_complete'
};

// Export the Firebase app instance and other services
export { app, analytics, db, auth }; 