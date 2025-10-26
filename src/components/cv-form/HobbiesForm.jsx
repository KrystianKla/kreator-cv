import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Komponent formularza dla sekcji "Zainteresowania".
// EN: Form component for the "Hobbies" section.

const HobbiesForm = () => {
  // PL: Pobranie danych CV, funkcji aktualizującej i funkcji przełączającej sekcję z kontekstu
  // EN: Get CV data, update function, and section toggle function from the context
  const { cvData, updateHobbies, toggleSection } = useCV();

  return (
    <fieldset className="form-section">
      <legend>
        Zainteresowania
        <button
          type="button"
          className="btn-remove-section"
          title="Ukryj tę sekcję"
          onClick={() => toggleSection('Zainteresowania')}
        >
          ×
        </button>
      </legend>

      <p className="section-description">
        Wymień krótko swoje hobby. Pokaż rekruterowi trochę swojej osobowości.
      </p>

      <div className="form-group">
        <textarea
          name="hobbies"
          rows="4"
          value={cvData.hobbies}
          onChange={(e) => updateHobbies(e.target.value)}
          placeholder="Np. Wędrówki górskie, Nowe technologie, Literatura faktu, Gry planszowe..."
        />
      </div>
    </fieldset>
  );
};

export default HobbiesForm;