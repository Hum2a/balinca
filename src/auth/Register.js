import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import Modal from '../quiz/widgets/modals/Modal';
import '../pages/Homepage.css';

const Register = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  const navigate = useNavigate();
  const { register, signInWithGoogle, signInWithApple } = useAuth();

  const validateLoginCode = async (code) => {
    try {
      const codeRef = doc(db, 'Login Codes', code);
      const codeDoc = await getDoc(codeRef);
      
      if (!codeDoc.exists()) {
        throw new Error('Invalid login code');
      }
      
      const codeData = codeDoc.data();
      if (!codeData.active) {
        throw new Error('This login code is no longer active');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setModalConfig({
        title: 'Error',
        message: 'Passwords do not match!',
        type: 'error'
      });
      setModalOpen(true);
      return;
    }

    try {
      // Validate login code first
      await validateLoginCode(loginCode);

      // If code is valid, proceed with registration
      const user = await register(email, password);
      console.log("Registered user:", user);
      
      // Add initial funds to the user's account
      await setDoc(doc(db, user.uid, 'Total Funds'), {
        totalFunds: 10000
      });

      // Initialize login streak
      const currentDate = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, user.uid, 'Login Streak'), {
        lastLogin: currentDate,
        streak: 1
      });

      // Update the login code with the last used information
      const codeRef = doc(db, 'Login Codes', loginCode);
      await setDoc(codeRef, {
        lastUsedBy: user.uid,
        active: true
      }, { merge: true });

      setModalConfig({
        title: 'Welcome to LifeSmart!',
        message: 'Your account has been successfully created with £10,000 initial funds.',
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 2000);
    } catch (error) {
      console.error("Authentication error:", error.message);
      setModalConfig({
        title: 'Authentication Error',
        message: error.message,
        type: 'error'
      });
      setModalOpen(true);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      // Validate login code first
      if (!loginCode) {
        throw new Error('Please enter a valid login code');
      }
      await validateLoginCode(loginCode);

      let user;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'apple') {
        user = await signInWithApple();
      }
      
      // Initialize login streak for new social sign-ins
      const currentDate = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, user.uid, 'Login Streak'), {
        lastLogin: currentDate,
        streak: 1
      });

      // Update the login code with the last used information
      const codeRef = doc(db, 'Login Codes', loginCode);
      await setDoc(codeRef, {
        lastUsedBy: user.uid,
        active: true
      }, { merge: true });
      
      console.log(`${provider} signed in user:`, user);
      setModalConfig({
        title: 'Welcome!',
        message: `You have successfully signed in with ${provider}.`,
        type: 'success'
      });
      setModalOpen(true);
      setTimeout(() => {
        navigate('/select');
      }, 2000);
    } catch (error) {
      console.error(`${provider} sign-in error:`, error.message);
      setModalConfig({
        title: 'Authentication Error',
        message: error.message,
        type: 'error'
      });
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="homescreen-form-container">
        <form onSubmit={handleSubmit} className="homescreen-modern-form">
          <h2 className="homescreen-form-title">Join Us</h2>
          
          <div className="homescreen-input-group">
            <label htmlFor="loginCode">Login Code</label>
            <input
              id="loginCode"
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="Enter your login code"
              required
              className="homescreen-modern-input"
            />
          </div>

          <div className="homescreen-social-buttons">
            <button 
              type="button"
              onClick={() => handleSocialSignIn('google')} 
              className="homescreen-social-button homescreen-google-button"
            >
              <FaGoogle className="homescreen-social-icon" />
              <span>Continue with Google</span>
            </button>
            
            <button 
              type="button"
              onClick={() => handleSocialSignIn('apple')} 
              className="homescreen-social-button homescreen-apple-button"
            >
              <FaApple className="homescreen-social-icon" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="homescreen-divider">
            <span>or</span>
          </div>

          <div className="homescreen-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="homescreen-modern-input"
            />
          </div>
          <div className="homescreen-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="homescreen-modern-input"
            />
          </div>
          <div className="homescreen-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="homescreen-modern-input"
            />
          </div>
          <div className="homescreen-form-actions">
            <button type="submit" className="homescreen-modern-button homescreen-submit-button">
              Create Account
            </button>
            <button type="button" onClick={onClose} className="homescreen-modern-button homescreen-cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </>
  );
};

export default Register;
