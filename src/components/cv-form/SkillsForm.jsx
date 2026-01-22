import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const StarRating = ({ level, onSetLevel }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          className={`star ${starValue <= level ? 'filled' : ''}`}
          onClick={() => onSetLevel(starValue)}
          title={`Poziom ${starValue}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const SkillsForm = () => {
  const { cvData, addSkill, removeSkill, updateSkill, toggleSection } = useCV();

  return (
    <FormSection 
      title="Umiejętności" 
      description="Oceń swoje kluczowe umiejętności w skali od 1 (początkujący) do 5 (ekspert)."
      onRemove={() => toggleSection('Umiejętności')}
    >
      <div className="skills-list">
        {cvData.skills.map((skill) => (
          <div key={skill.id} className="skill-entry">
            <FormField
              placeholder="Np. React, Python, UI Design..."
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
            />

            <StarRating
              level={skill.level}
              onSetLevel={(newLevel) => updateSkill(skill.id, 'level', newLevel)}
            />

            <button
              type="button"
              className="btn-delete-minimal skill-delete"
              onClick={() => removeSkill(skill.id)}
              title="Usuń umiejętność"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn-add" onClick={addSkill}>
        + Dodaj umiejętność
      </button>
    </FormSection>
  );
};

export default SkillsForm;