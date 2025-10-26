import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Komponent formularza dla sekcji "Media społecznościowe / Linki".
// EN: Form component for the "Social Media / Links" section.

const SocialsForm = () => {
  // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
  // EN: Get state and functions from the global CV context
  const { cvData, addSocial, removeSocial, updateSocial, toggleSection } = useCV();

  // PL: Handler do aktualizacji pól formularza (etykieta, URL).
  // EN: Handler to update form fields (label, URL).

  const handleChange = (id, e) => {
    updateSocial(id, e.target.name, e.target.value);
  };

  return (
    <fieldset className="form-section">
      <legend>
        Media społecznościowe
        <button
          type="button"
          className="btn-remove-section"
          title="Ukryj tę sekcję"
          onClick={() => toggleSection('Media społecznościowe')}
        >
          ×
        </button>
      </legend>

      <p className="section-description">
        Podaj linki do swoich profili zawodowych, takich jak LinkedIn, GitHub czy Portfolio.
      </p>

      {/* PL: Kontener na listę linków */}
      {/* EN: Container for the list of links */}
      <div className="socials-list">
        {cvData.socials.map((social) => (
          <div key={social.id} className="social-entry">
            <div className="form-group">
              <input
                type="text"
                name="label"
                value={social.label}
                onChange={(e) => handleChange(social.id, e)}
                placeholder="Platforma (np. LinkedIn)"
              />
            </div>
            <div className="form-group">
              {/* PL: Sugerujemy użycie typu "url" dla lepszej walidacji i klawiatury mobilnej */}
              {/* EN: Suggest using type "url" for better validation and mobile keyboard */}
              <input
                type="url"
                name="url"
                value={social.url}
                onChange={(e) => handleChange(social.id, e)}
                placeholder="Adres URL (https://...)"
              />
            </div>
            <button
              type="button"
              className="btn-delete-minimal skill-delete"
              onClick={() => removeSocial(social.id)}
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-add"
        onClick={addSocial}
      >
        + Dodaj link
      </button>
    </fieldset>
  );
};

export default SocialsForm;