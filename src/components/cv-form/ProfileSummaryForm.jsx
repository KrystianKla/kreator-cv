import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const ProfileSummaryForm = () => {
  const { cvData, updateSummary } = useCV();

  return (
    <FormSection 
      title="Profil Osobisty" 
      description="Twoje podsumowanie zawodowe to pierwsze, co przeczyta rekruter. Skup się na swoich największych sukcesach i celach."
    >
      <FormField
        label="Podsumowanie zawodowe"
        id="profile-summary"
        type="textarea"
        rows="6"
        value={cvData.summary}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Np. Zmotywowany absolwent informatyki z rocznym doświadczeniem w tworzeniu aplikacji webowych w React. Poszukuję stanowiska Junior Frontend Developera, na którym będę mógł rozwijać swoje umiejętności..."
      />
      <p className="field-hint">
        Wskazówka: Postaraj się zmieścić w 3-5 zdaniach.
      </p>
    </FormSection>
  );
};

export default ProfileSummaryForm;