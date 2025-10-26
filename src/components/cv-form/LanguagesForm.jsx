import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Poziomy biegłości językowej wg skali CEFR
// EN: Language proficiency levels based on the CEFR scale
const proficiencyLevels = [
  'Początkujący (A1)',
  'Podstawowy (A2)',
  'Komunikatywny (B1)',
  'Średnio-zaawansowany (B2)',
  'Biegły (C1)',
  'Poziom ojczysty (C2)',
];

// PL: Komponent formularza dla sekcji "Języki".
// EN: Form component for the "Languages" section.

const LanguagesForm = () => {
  // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
  // EN: Get state and functions from the global CV context
  const { cvData, addLanguage, removeLanguage, updateLanguage, toggleSection } = useCV();

  // PL: Handler do aktualizacji pól formularza (nazwa języka, poziom)
  // EN: Handler to update form fields (language name, level)
  const handleChange = (id, e) => {
    updateLanguage(id, e.target.name, e.target.value);
  };

  return (
    <fieldset className="form-section">
      <legend>
        Języki
        <button
          type="button"
          className="btn-remove-section"
          title="Ukryj tę sekcję"
          onClick={() => toggleSection('Języki')}
        >
          ×
        </button>
      </legend>

      <p className="section-description">
        Wymień języki, którymi się posługujesz, i określ swój poziom.
      </p>

      {/* PL: Kontener na listę języków, używa stylów z sekcji Umiejętności */}
      {/* EN: Container for the language list, uses styles from the Skills section */}
      <div className="skills-list">
        {cvData.languages.map((lang) => (
          <div key={lang.id} className="skill-entry">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={lang.name}
                onChange={(e) => handleChange(lang.id, e)}
                placeholder="Np. Angielski"
              />
            </div>

            <select
              name="level"
              value={lang.level}
              onChange={(e) => handleChange(lang.id, e)}
              className="form-select"
            >
              {proficiencyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <button
              type="button"
              className="btn-delete-minimal skill-delete"
              onClick={() => removeLanguage(lang.id)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-add"
        onClick={addLanguage}
      >
        + Dodaj język
      </button>
    </fieldset>
  );
};

export default LanguagesForm;