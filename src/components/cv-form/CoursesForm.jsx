import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { pl } from 'date-fns/locale/pl';

// PL: Rejestracja polskiej lokalizacji dla DatePicker
// EN: Register Polish locale for DatePicker
registerLocale('pl', pl);
setDefaultLocale('pl');

// PL: Komponent formularza dla sekcji "Kursy".
// EN: Form component for the "Courses" section.

const CoursesForm = () => {
    // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
    // EN: Get state and functions from the global CV context
    const {
        cvData,
        addCourse,
        removeCourse,
        updateCourse,
        toggleSection,
    } = useCV();

    // PL: Stan lokalny do śledzenia, który wpis akordeonu jest otwarty
    // EN: Local state to track which accordion entry is open
    const [activeEntryId, setActiveEntryId] = useState(null);

    // PL: Handler do aktualizacji pól formularza (tekstowych)
    // EN: Handler to update (text) form fields
    const handleChange = (id, e) => {
        updateCourse(id, e.target.name, e.target.value);
    };

    // PL: Handler dodający nowy kurs i otwierający go do edycji
    // EN: Handler to add a new course and open it for editing
    const handleAddCourse = () => {
        const newId = addCourse();
        setActiveEntryId(newId);
    };

    // PL: Handler do przełączania (otwierania/zamykania) wpisu w akordeonie
    // EN: Handler to toggle (open/close) an accordion entry
    const toggleEntry = (id) => {
        if (activeEntryId === id) {
            setActiveEntryId(null);
        } else {
            setActiveEntryId(id);
        }
    };

    return (
        <fieldset className="form-section">
            <legend>
                Kursy
                <button
                    type="button"
                    className="btn-remove-section"
                    title="Ukryj tę sekcję"
                    onClick={() => toggleSection('Kursy')}
                >
                    ×
                </button>
            </legend>
            <p className="section-description">
                Wymień ukończone kursy, szkolenia lub warsztaty.
            </p>

            <div className="accordion-container">
                {cvData.courses.map((entry) => {
                    const isOpen = activeEntryId === entry.id;

                    // PL: Dynamiczne tworzenie tytułu dla wpisu w akordeonie
                    // EN: Dynamically create a title for the accordion entry
                    const title = (entry.courseName || entry.provider)
                        ? `${entry.courseName || '(Nazwa kursu)'} przez ${entry.provider || '(Prowadzący)'}`
                        : "Nowy kurs";

                    return (
                        <div key={entry.id} className="form-entry-accordion">
                            <div
                                className="form-entry-header"
                                onClick={() => toggleEntry(entry.id)}
                            >
                                <span className="form-entry-title">{title}</span>
                                <div className="form-entry-controls">
                                    <button
                                        type="button"
                                        className="btn-delete-minimal"
                                        onClick={(e) => {
                                            e.stopPropagation(); // PL: Zapobiegaj przełączaniu akordeonu przy usuwaniu / EN: Prevent accordion toggle on delete
                                            removeCourse(entry.id);
                                        }}
                                    >
                                        Usuń
                                    </button>
                                    <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="form-entry-content">
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label htmlFor={`course-name-${entry.id}`}>Nazwa kursu</label>
                                            <input
                                                type="text"
                                                id={`course-name-${entry.id}`}
                                                name="courseName"
                                                value={entry.courseName}
                                                onChange={(e) => handleChange(entry.id, e)}
                                                placeholder="Kurs React od A do Z"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`provider-${entry.id}`}>Prowadzony przez</label>
                                            <input
                                                type="text"
                                                id={`provider-${entry.id}`}
                                                name="provider"
                                                value={entry.provider}
                                                onChange={(e) => handleChange(entry.id, e)}
                                                placeholder="Udemy"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor={`location-${entry.id}`}>Lokalizacja (opcjonalnie)</label>
                                        <input
                                            type="text"
                                            id={`location-${entry.id}`}
                                            name="location"
                                            value={entry.location}
                                            onChange={(e) => handleChange(entry.id, e)}
                                            placeholder="Online"
                                        />
                                    </div>

                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label htmlFor={`startDate-${entry.id}`}>Data rozpoczęcia</label>
                                            <DatePicker
                                                id={`startDate-${entry.id}`}
                                                selected={entry.startDate ? new Date(entry.startDate) : null}
                                                onChange={(date) => {
                                                    const dateString = date.toISOString().split('T')[0];
                                                    updateCourse(entry.id, 'startDate', dateString);
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                locale="pl"
                                                className="date-picker-input"
                                                placeholderText="mm / rrrr"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`endDate-${entry.id}`}>Data końcowa</label>
                                            <DatePicker
                                                id={`endDate-${entry.id}`}
                                                selected={entry.endDate ? new Date(entry.endDate) : null}
                                                onChange={(date) => {
                                                    const dateString = date.toISOString().split('T')[0];
                                                    updateCourse(entry.id, 'endDate', dateString);
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                locale="pl"
                                                className="date-picker-input"
                                                placeholderText="mm / rrrr"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor={`summary-${entry.id}`}>Podsumowanie (opcjonalnie)</label>
                                        <textarea
                                            id={`summary-${entry.id}`}
                                            name="summary"
                                            rows="4"
                                            value={entry.summary}
                                            onChange={(e) => handleChange(entry.id, e)}
                                            placeholder="Np. Czego dotyczył kurs, jakie technologie zostały użyte..."
                                        />
                                    </div>

                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                className="btn-add"
                onClick={handleAddCourse}
            >
                + Dodaj kurs
            </button>

        </fieldset>
    );
};

export default CoursesForm;