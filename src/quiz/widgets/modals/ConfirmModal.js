import React from 'react';
import './styles/ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info' // can be 'info', 'warning', 'danger'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <button className="confirm-modal-close" onClick={onClose}>×</button>
        
        <div className="confirm-modal-content">
          <h2 className="confirm-modal-title">{title}</h2>
          <p className="confirm-modal-message">{message}</p>
          
          <div className="confirm-modal-buttons">
            <button 
              className="confirm-modal-button confirm-modal-cancel" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`confirm-modal-button confirm-modal-confirm confirm-modal-${type}`}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 