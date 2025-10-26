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

// PL: Komponent formularza dla sekcji "Edukacja".
// EN: Form component for the "Education" section.

const EducationForm = () => {
  // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
  // EN: Get state and functions from the global CV context
  const {
    cvData,
    addEducation,
    removeEducation,
    updateEducation,
    toggleEducationCurrentlyStudying,
    toggleSection,
  } = useCV();

  // PL: Stan lokalny do śledzenia, który wpis akordeonu jest otwarty
  // EN: Local state to track which accordion entry is open
  const [activeEntryId, setActiveEntryId] = useState(null);

  // PL: Handler do aktualizacji pól formularza (tekstowych)
  // EN: Handler to update (text) form fields
  const handleChange = (id, e) => {
    updateEducation(id, e.target.name, e.target.value);
  };

  // PL: Handler dodający nową pozycję edukacji i otwierający ją do edycji
  // EN: Handler to add a new education entry and open it for editing
  const handleAddEducation = () => {
    const newId = addEducation();
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
        Edukacja
        {/* PL: Przycisk do zamykania/ukrywania całej sekcji / EN: Button to close/hide the entire section */}
        <button
          type="button"
          className="btn-remove-section"
          title="Ukryj tę sekcję"
          onClick={() => toggleSection('Edukacja')}
        >
          ×
        </button>
      </legend>
      <p className="section-description">
        Wymień swoje wykształcenie, zaczynając od najnowszego.
      </p>

      <div className="accordion-container">
        {cvData.education.map((entry) => {
          const isOpen = activeEntryId === entry.id;

          // PL: Dynamiczne tworzenie tytułu dla wpisu w akordeonie
          // EN: Dynamically create a title for the accordion entry
          const title = (entry.degree || entry.institution)
            ? `${entry.degree || '(Kierunek / Stopień)'} na ${entry.institution || '(Uczelnia / Instytucja)'}`
            : "Nowa edukacja";

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
                      e.stopPropagation();
                      removeEducation(entry.id);
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
                      <label htmlFor={`degree-${entry.id}`}>Kierunek / Stopień</label>
                      <input
                        type="text"
                        id={`degree-${entry.id}`}
                        name="degree"
                        value={entry.degree}
                        onChange={(e) => handleChange(entry.id, e)}
                        placeholder="Inżynieria Oprogramowania"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`institution-${entry.id}`}>Uczelnia / Instytucja</label>
                      <input
                        type="text"
                        id={`institution-${entry.id}`}
                        name="institution"
                        value={entry.institution}
                        onChange={(e) => handleChange(entry.id, e)}
                        placeholder="Akademia WSB w Dąbrowie Górniczej"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`location-${entry.id}`}>Lokalizacja</label>
                    <input
                      type="text"
                      id={`location-${entry.id}`}
                      name="location"
                      value={entry.location}
                      onChange={(e) => handleChange(entry.id, e)}
                      placeholder="Warszawa"
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
                          updateEducation(entry.id, 'startDate', dateString);
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
                          updateEducation(entry.id, 'endDate', dateString);
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        locale="pl"
                        className="date-picker-input"
                        placeholderText="mm / rrrr"
                        disabled={entry.currentlyStudying}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={entry.currentlyStudying}
                        onChange={() => toggleEducationCurrentlyStudying(entry.id)}
                      />
                      <span>Obecnie studiuję</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`summary-${entry.id}`}>Opis (np. praca dyplomowa, osiągnięcia)</label>
                    <textarea
                      id={`summary-${entry.id}`}
                      name="summary"
                      rows="4"
                      value={entry.summary}
                      onChange={(e) => handleChange(entry.id, e)}
                      placeholder="Np. Temat pracy dyplomowej, działalność w kołach naukowych..."
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
        onClick={handleAddEducation}
      >
        + Dodaj edukację
      </button>

    </fieldset>
  );
};

export default EducationForm;