import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Pełna lista dostępnych dodatkowych sekcji
// EN: Full list of available extra sections
const allAvailableSections = [
  'Zainteresowania',
  'Kursy',
  'Języki',
  'Staże',
  'Certyfikaty',
  'Media społecznościowe',
];

// PL: Komponent formularza zarządzający włączaniem/wyłączaniem dodatkowych sekcji CV.
// EN: Form component managing the activation/deactivation of extra CV sections.

const ExtraSectionsForm = () => {
  // PL: Pobranie stanu sekcji i funkcji przełączającej z kontekstu CV
  // EN: Get section state and toggle function from the CV context
  const { cvData, toggleSection } = useCV();

  return (
    <fieldset className="form-section">
      <legend>Dodatkowe informacje</legend>
      <p className="section-description">
        Kliknij, aby włączyć lub wyłączyć dodatkowe sekcje w swoim CV.
      </p>

      {/* PL: Kontener na przyciski przełączające sekcje */}
      {/* EN: Container for the section toggle buttons */}
      <div className="section-adder-grid">
        {allAvailableSections.map(name => {
          // PL: Sprawdzenie, czy bieżąca sekcja jest aktywna
          // EN: Check if the current section is active
          const isActive = cvData.sections[name];

          return (
            <button
              key={name}
              type="button"
              // PL: Dynamiczne dodanie klasy 'active' dla aktywnej sekcji
              // EN: Dynamically add the 'active' class for an active section
              className={`btn-add-section ${isActive ? 'active' : ''}`}
              // PL: Kliknięcie zawsze wywołuje funkcję przełączającą
              // EN: Click always calls the toggle function
              onClick={() => toggleSection(name)}
            >
              {/* PL: Zmiana tekstu przycisku w zależności od stanu (aktywny/nieaktywny) */}
              {/* EN: Change button text based on the state (active/inactive) */}
              {isActive ? `✓ ${name}` : `+ ${name}`}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default ExtraSectionsForm;