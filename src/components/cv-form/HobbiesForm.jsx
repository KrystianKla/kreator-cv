import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const HobbiesForm = () => {
  const { cvData, updateHobbies, toggleSection } = useCV();

  return (
    <FormSection
      title="Zainteresowania"
      description="Wymień krótko swoje hobby. Pokaż rekruterowi trochę swojej osobowości poza pracą."
      onRemove={() => toggleSection('Zainteresowania')}
    >
      <FormField
        id="hobbies-textarea"
        name="hobbies"
        type="textarea"
        rows="4"
        value={cvData.hobbies}
        onChange={(e) => updateHobbies(e.target.value)}
        placeholder="Np. Wędrówki górskie, Nowe technologie, Literatura faktu, Gry planszowe..."
      />
    </FormSection>
  );
};

export default HobbiesForm;