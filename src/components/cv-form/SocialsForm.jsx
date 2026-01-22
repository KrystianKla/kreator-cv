import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const SocialsForm = () => {
  const { cvData, addSocial, removeSocial, updateSocial, toggleSection } = useCV();

  return (
    <FormSection 
      title="Media społecznościowe" 
      description="Podaj linki do swoich profili zawodowych, takich jak LinkedIn, GitHub czy Portfolio."
      onRemove={() => toggleSection('Media społecznościowe')}
    >
      <div className="socials-list">
        {cvData.socials.map((social) => (
          <div key={social.id} className="social-entry">
            <FormField
              placeholder="Platforma (np. LinkedIn)"
              value={social.label}
              onChange={(e) => updateSocial(social.id, 'label', e.target.value)}
            />

            <FormField
              type="url"
              placeholder="Adres URL (https://...)"
              value={social.url}
              onChange={(e) => updateSocial(social.id, 'url', e.target.value)}
            />

            <button
              type="button"
              className="btn-delete-minimal skill-delete"
              onClick={() => removeSocial(social.id)}
              title="Usuń link"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn-add" onClick={addSocial}>
        + Dodaj link
      </button>
    </FormSection>
  );
};

export default SocialsForm;