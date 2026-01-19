import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// Lokalizacja jest już zarejestrowana globalnie w systemie, 
// ale tutaj upewniamy się, że komponent z niej korzysta.

const FormDatePicker = ({ label, id, selected, onChange, placeholder = "mm / rrrr", disabled }) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <DatePicker
                id={id}
                selected={selected ? new Date(selected) : null}
                onChange={(date) => {
                    // Konwersja obiektu Date na string YYYY-MM-DD dla bazy danych
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