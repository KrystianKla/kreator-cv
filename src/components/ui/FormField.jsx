import React from 'react';

const FormField = ({ label, id, type = 'text', ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id}>{label}</label>}
    {type === 'textarea' ? <textarea id={id} {...props} /> : <input id={id} type={type} {...props} />}
  </div>
);

export default FormField;