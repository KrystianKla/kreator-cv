import React from 'react';
import Modal from 'react-modal';

const SectionModal = ({ isOpen, onClose, title, children, isLarge = false }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            className={`modal-content ${isLarge ? 'modal-content-large' : ''}`} 
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2>{title}</h2>
                <button className="btn-close-modal" onClick={onClose}>×</button>
            </div>
            
            <div className="modal-body">
                {children}
            </div>

            <div className="modal-actions">
                <button className="btn-save-profile" onClick={onClose}>
                    Zamknij
                </button>
            </div>
        </Modal>
    );
};

export default SectionModal;