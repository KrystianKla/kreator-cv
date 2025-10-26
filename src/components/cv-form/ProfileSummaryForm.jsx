import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Komponent formularza dla sekcji "Profil Osobisty".
// EN: Form component for the "Profile Summary" section.

const ProfileSummaryForm = () => {
  // PL: Pobranie danych CV i funkcji aktualizującej z kontekstu
  // EN: Get CV data and update function from the context
  const { cvData, updateSummary } = useCV();

  // PL: Handler aktualizujący pole 'summary' w globalnym stanie.
  // EN: Handler to update the 'summary' field in the global state.

  const handleChange = (e) => {
    updateSummary(e.target.value);
  };

  return (
    <fieldset className="form-section">
      <legend>Profil Osobisty</legend>
      <div className="form-group">
        <label htmlFor="summary">
          Opisz krótko swoje cele zawodowe i najmocniejsze strony. To Twoja "winda" - masz kilka sekund, by zachęcić rekrutera.
        </label>
        <textarea
          id="summary"
          name="summary"
          value={cvData.summary}
          onChange={handleChange}
          rows="5"
          placeholder="Np. Zmotywowany absolwent informatyki z rocznym doświadczeniem w tworzeniu aplikacji webowych w React. Poszukuję stanowiska Junior Frontend Developera, na którym będę mógł rozwijać swoje umiejętności i przyczyniać się do tworzenia innowacyjnych produktów."
        />
      </div>
    </fieldset>
  );
};

export default ProfileSummaryForm;