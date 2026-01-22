import React from 'react';

const ToggleButton = ({ label, isActive, onClick }) => (
  <button
    type="button"
    className={`btn-add-section ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {isActive ? `✓ ${label}` : `+ ${label}`}
  </button>
);

export default ToggleButton;