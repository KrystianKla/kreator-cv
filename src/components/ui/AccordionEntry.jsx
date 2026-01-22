import React from 'react';

const AccordionEntry = ({ title, isOpen, onToggle, onDelete, children }) => (
  <div className="form-entry-accordion">
    <div className="form-entry-header" onClick={onToggle}>
      <span className="form-entry-title">{title}</span>
      <div className="form-entry-controls">
        <button type="button" className="btn-delete-minimal" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Usuń</button>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
    </div>
    {isOpen && <div className="form-entry-content">{children}</div>}
  </div>
);

export default AccordionEntry;