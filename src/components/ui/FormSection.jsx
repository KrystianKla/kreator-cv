import React from 'react';

const FormSection = ({ title, description, onRemove, children }) => (
  <fieldset className="form-section">
    <legend>
      {title}
      {onRemove && <button type="button" className="btn-remove-section" onClick={onRemove}>×</button>}
    </legend>
    {description && <p className="section-description">{description}</p>}
    {children}
  </fieldset>
);

export default FormSection;