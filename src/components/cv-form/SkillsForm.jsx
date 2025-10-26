import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

/**
 * PL: Komponent do wyświetlania i interaktywnego ustawiania oceny gwiazdkowej (1-5).
 * EN: Component for displaying and interactively setting a star rating (1-5).
 * @param {object} props - Właściwości komponentu / Component props
 * @param {number} props.level - Aktualnie wybrany poziom (liczba gwiazdek) / Currently selected level (number of stars)
 * @param {function(number): void} props.onSetLevel - Funkcja zwrotna wywoływana przy zmianie poziomu / Callback function called when the level changes
 */
const StarRating = ({ level, onSetLevel }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          className={`star ${starValue <= level ? 'filled' : ''}`}
          onClick={() => onSetLevel(starValue)}
          onMouseOver={(e) => {
            Array.from(e.currentTarget.parentElement.children).forEach((star, i) => {
              if (i < starValue) star.classList.add('hover');
            });
          }}
          onMouseOut={(e) => {
            Array.from(e.currentTarget.parentElement.children).forEach(star => {
              star.classList.remove('hover');
            });
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// PL: Komponent formularza dla sekcji "Umiejętności".
// EN: Form component for the "Skills" section.

const SkillsForm = () => {
  // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
  // EN: Get state and functions from the global CV context
  const { cvData, addSkill, removeSkill, updateSkill, toggleSection } = useCV();

  // PL: Handler aktualizujący nazwę umiejętności w globalnym stanie.
  // EN: Handler to update the skill name in the global state.

  const handleNameChange = (id, e) => {
    updateSkill(id, 'name', e.target.value);
  };

  // PL: Handler aktualizujący poziom umiejętności (liczbę gwiazdek) w globalnym stanie.
  // EN: Handler to update the skill level (number of stars) in the global state.

  const handleLevelChange = (id, newLevel) => {
    updateSkill(id, 'level', newLevel);
  };

  return (
    <fieldset className="form-section">
      <legend>
        Umiejętności
        {/* PL: Przycisk do zamykania/ukrywania całej sekcji / EN: Button to close/hide the entire section */}
        <button
          type="button"
          className="btn-remove-section"
          title="Ukryj tę sekcję"
          onClick={() => toggleSection('Umiejętności')}
        >
          ×
        </button>
      </legend>
      <p className="section-description">
        Oceń swoje kluczowe umiejętności w skali od 1 (początkujący) do 5 (ekspert).
      </p>

      {/* PL: Kontener na listę wpisów umiejętności */}
      {/* EN: Container for the list of skill entries */}
      <div className="skills-list">
        {cvData.skills.map((skill) => (
          <div key={skill.id} className="skill-entry">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={skill.name}
                onChange={(e) => handleNameChange(skill.id, e)}
                placeholder="Np. React"
              />
            </div>
            <StarRating
              level={skill.level}
              onSetLevel={(newLevel) => handleLevelChange(skill.id, newLevel)}
            />
            <button
              type="button"
              className="btn-delete-minimal skill-delete"
              onClick={() => removeSkill(skill.id)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      {/* PL: Przycisk do dodawania nowej umiejętności */}
      {/* EN: Button to add a new skill */}
      <button
        type="button"
        className="btn-add"
        onClick={addSkill}
      >
        + Dodaj umiejętność
      </button>
    </fieldset>
  );
};

export default SkillsForm;