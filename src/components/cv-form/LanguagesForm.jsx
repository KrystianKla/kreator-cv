import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const proficiencyLevels = [
  'Początkujący (A1)',
  'Podstawowy (A2)',
  'Komunikatywny (B1)',
  'Średnio-zaawansowany (B2)',
  'Biegły (C1)',
  'Poziom ojczysty (C2)',
];

const LanguagesForm = () => {
  const { cvData, addLanguage, removeLanguage, updateLanguage, toggleSection } = useCV();

  return (
    <FormSection
      title="Języki"
      description="Wymień języki, którymi się posługujesz, i określ swój poziom biegłości."
      onRemove={() => toggleSection('Języki')}
    >
      <div className="skills-list">
        {cvData.languages.map((lang) => (
          <div key={lang.id} className="skill-entry">
            <FormField
              placeholder="Np. Angielski"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
            />

            <div className="form-group">
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                className="form-select"
              >
                <option value="" disabled>Poziom...</option>
                {proficiencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

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

      <button type="button" className="btn-add" onClick={addLanguage}>
        + Dodaj język
      </button>
    </FormSection>
  );
};

export default LanguagesForm;