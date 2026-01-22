import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const FormDatePicker = ({ label, id, selected, onChange, placeholder = "mm / rrrr", disabled }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <DatePicker
                id={id}
                selected={selected ? new Date(selected) : null}
                onChange={(date) => {
                    const dateString = date ? date.toISOString().split('T')[0] : "";
                    onChange(dateString);
                }}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                locale="pl"
                className="date-picker-input"
                placeholderText={placeholder}
                disabled={disabled}
            />
        </div>
    );
};

export default FormDatePicker;