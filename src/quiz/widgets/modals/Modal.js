import React from 'react';
import './styles/Modal.css';

const Modal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-icon ${type}`}>
          {type === 'success' ? '✓' : '✕'}
        </div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-close-button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default Modal; 