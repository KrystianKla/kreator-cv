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

// PL: Komponent formularza dla sekcji "Doświadczenie Zawodowe".
// EN: Form component for the "Work Experience" section.

const ExperienceForm = () => {
  // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
  // EN: Get state and functions from the global CV context
  const {
    cvData,
    addExperience,
    removeExperience,
    updateExperience,
    toggleExperienceCurrentlyWorking,
  } = useCV();

  // PL: Stan lokalny do śledzenia, który wpis akordeonu jest otwarty
  // EN: Local state to track which accordion entry is open
  const [activeEntryId, setActiveEntryId] = useState(null);

  // PL: Handler do aktualizacji pól formularza (tekstowych)
  // EN: Handler to update (text) form fields
  const handleChange = (id, e) => {
    updateExperience(id, e.target.name, e.target.value);
  };

  // PL: Handler dodający nową pozycję doświadczenia i otwierający ją do edycji
  // EN: Handler to add a new experience entry and open it for editing
  const handleAddExperience = () => {
    const newId = addExperience();
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
      <legend>Doświadczenie Zawodowe</legend>
      <p className="section-description">
        Wymień swoje poprzednie stanowiska, zaczynając od najnowszego.
      </p>

      <div className="accordion-container">
        {cvData.experience.map((entry) => {
          const isOpen = activeEntryId === entry.id;

          // PL: Dynamiczne tworzenie tytułu dla wpisu w akordeonie
          // EN: Dynamically create a title for the accordion entry
          const title = (entry.position || entry.company)
            ? `${entry.position || '(Stanowisko)'} w ${entry.company || '(Firma)'}`
            : "Nowe doświadczenie";

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
                      removeExperience(entry.id);
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
                      <label htmlFor={`position-${entry.id}`}>Stanowisko</label>
                      <input
                        type="text"
                        id={`position-${entry.id}`}
                        name="position"
                        value={entry.position}
                        onChange={(e) => handleChange(entry.id, e)}
                        placeholder="Frontend Developer"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`company-${entry.id}`}>Firma</label>
                      <input
                        type="text"
                        id={`company-${entry.id}`}
                        name="company"
                        value={entry.company}
                        onChange={(e) => handleChange(entry.id, e)}
                        placeholder="Google"
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
                          updateExperience(entry.id, 'startDate', dateString);
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
                          updateExperience(entry.id, 'endDate', dateString);
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        locale="pl"
                        className="date-picker-input"
                        placeholderText="mm / rrrr"
                        disabled={entry.currentlyWorking}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={entry.currentlyWorking}
                        onChange={() => toggleExperienceCurrentlyWorking(entry.id)}
                      />
                      <span>Obecnie pracuję na tym stanowisku</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`summary-${entry.id}`}>Podsumowanie (Opis obowiązków)</label>
                    <textarea
                      id={`summary-${entry.id}`}
                      name="summary"
                      rows="4"
                      value={entry.summary}
                      onChange={(e) => handleChange(entry.id, e)}
                      placeholder="Np. Rozwój interfejsów użytkownika, praca w zespole Scrum, optymalizacja aplikacji..."
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
        onClick={handleAddExperience}
      >
        + Dodaj doświadczenie
      </button>

    </fieldset>
  );
};

export default ExperienceForm;