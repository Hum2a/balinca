import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/initFirebase';
import './styles/EditModal.css';

const EditModal = ({ isOpen, onClose, userId, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    class: '',
    groupCode: '',
    isActive: true,
    admin: false,
    developer: false,
    user: true,
    totalFunds: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        // Fetch main user document
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);
        
        // Fetch profile document
        const profileRef = doc(db, userId, 'Profile');
        const profileSnap = await getDoc(profileRef);

        if (userSnap.exists() && profileSnap.exists()) {
          const userData = userSnap.data();
          const profileData = profileSnap.data();
          
          setUserData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            school: userData.school || '',
            class: userData.class || '',
            groupCode: userData.groupCode || '',
            isActive: userData.isActive !== false,
            admin: userData.admin || false,
            developer: userData.developer || false,
            user: userData.user !== false,
            totalFunds: userData.totalFunds || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update main user document
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, userData);
      
      // Update profile document
      const profileRef = doc(db, userId, 'Profile');
      await updateDoc(profileRef, userData);

      onSave && onSave(userData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <button className="edit-modal-close" onClick={onClose}>×</button>
        
        <div className="edit-modal-content">
          <h2 className="edit-modal-title">Edit User Details</h2>
          
          {loading ? (
            <div className="edit-modal-loading">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-modal-form">
              <div className="edit-modal-section">
                <h3>Personal Information</h3>
                <div className="edit-modal-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-modal-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-modal-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-modal-field">
                  <label htmlFor="totalFunds">Total Funds (£)</label>
                  <input
                    type="number"
                    id="totalFunds"
                    name="totalFunds"
                    value={userData.totalFunds}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="edit-modal-section">
                <h3>School Information</h3>
                <div className="edit-modal-field">
                  <label htmlFor="school">School</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={userData.school}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-modal-field">
                  <label htmlFor="class">Class</label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    value={userData.class}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-modal-field">
                  <label htmlFor="groupCode">Group Code</label>
                  <input
                    type="text"
                    id="groupCode"
                    name="groupCode"
                    value={userData.groupCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="edit-modal-section">
                <h3>Account Status</h3>
                <div className="edit-modal-checkboxes">
                  <label className="edit-modal-checkbox">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={userData.isActive}
                      onChange={handleChange}
                    />
                    Active Account
                  </label>
                  <label className="edit-modal-checkbox">
                    <input
                      type="checkbox"
                      name="admin"
                      checked={userData.admin}
                      onChange={handleChange}
                    />
                    Admin
                  </label>
                  <label className="edit-modal-checkbox">
                    <input
                      type="checkbox"
                      name="developer"
                      checked={userData.developer}
                      onChange={handleChange}
                    />
                    Developer
                  </label>
                  <label className="edit-modal-checkbox">
                    <input
                      type="checkbox"
                      name="user"
                      checked={userData.user}
                      onChange={handleChange}
                    />
                    Regular User
                  </label>
                </div>
              </div>

              <div className="edit-modal-actions">
                <button type="button" className="edit-modal-button cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="edit-modal-button save">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal; 