import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/initFirebase';
import Modal from '../quiz/widgets/modals/Modal';
import '../pages/Homepage.css';
import { sanitizeInput, isValidEmail, validatePassword } from '../utils/validation';
import { encryptSensitiveFields } from '../utils/encryption';

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
  const [passwordError, setPasswordError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailError, setEmailError] = useState('');
  
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

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    
    if (email && !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    const { isValid, message } = validatePassword(newPassword);
    setPasswordError(isValid ? '' : message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      setModalConfig({
        title: 'Validation Error',
        message: 'Please enter a valid email address',
        type: 'error'
      });
      setModalOpen(true);
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      setModalConfig({
        title: 'Validation Error',
        message: passwordValidation.message,
        type: 'error'
      });
      setModalOpen(true);
      return;
    }
    
    if (password !== confirmPassword) {
      setModalConfig({
        title: 'Validation Error',
        message: 'Passwords do not match',
        type: 'error'
      });
      setModalOpen(true);
      return;
    }

    if (!displayName.trim()) {
      setModalConfig({
        title: 'Validation Error',
        message: 'Please provide your name',
        type: 'error'
      });
      setModalOpen(true);
      return;
    }

    try {
      await validateLoginCode(loginCode);

      const sanitizedDisplayName = sanitizeInput(displayName.trim());
      const user = await register(email, password, sanitizedDisplayName);
      console.log("Registered user:", user);
      
      const userProfile = {
        displayName: sanitizedDisplayName,
        email: email,
        createdAt: new Date().toISOString(),
        preferences: {},
      };
      
      const encryptedProfile = encryptSensitiveFields(userProfile, ['email']);
      
      await setDoc(doc(db, "userProfiles", user.uid), encryptedProfile);
      
      setModalConfig({
        title: 'Registration Successful',
        message: 'Your account has been created successfully.',
        type: 'success'
      });
      setModalOpen(true);
      
      setTimeout(() => {
        navigate('/select', { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setModalConfig({
        title: 'Registration Error',
        message: error.message,
        type: 'error'
      });
      setModalOpen(true);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
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
      
      const currentDate = new Date().toISOString().split('T')[0];
      await setDoc(doc(db, user.uid, 'Login Streak'), {
        lastLogin: currentDate,
        streak: 1
      });

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
          <h2 className="homescreen-form-title">Create Account</h2>
          
          <div className="homescreen-input-group">
            <label htmlFor="displayName">Full Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="homescreen-modern-input"
            />
          </div>

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
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              className={`homescreen-modern-input ${emailError ? 'error' : ''}`}
            />
            {emailError && <div className="input-error">{emailError}</div>}
          </div>
          <div className="homescreen-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create a password"
              required
              className={`homescreen-modern-input ${passwordError ? 'error' : ''}`}
            />
            {passwordError && (
              <div className="password-requirement-error">{passwordError}</div>
            )}
            <div className="password-requirements">
              <p>Password must:</p>
              <ul>
                <li className={password.length >= 8 ? 'met' : ''}>Be at least 8 characters long</li>
                <li className={/[A-Z]/.test(password) ? 'met' : ''}>Contain an uppercase letter</li>
                <li className={/[a-z]/.test(password) ? 'met' : ''}>Contain a lowercase letter</li>
                <li className={/[0-9]/.test(password) ? 'met' : ''}>Contain a number</li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'met' : ''}>Contain a special character</li>
              </ul>
            </div>
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
