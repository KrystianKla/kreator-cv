import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import AccordionEntry from '../ui/AccordionEntry';
import FormField from '../ui/FormField';
import FormDatePicker from '../ui/FormDatePicker';
import './FormStyles.css';

const ExperienceForm = () => {
  const { cvData, addExperience, removeExperience, updateExperience, toggleSection } = useCV();
  const [activeEntryId, setActiveEntryId] = useState(null);

  const handleAdd = () => {
    const newId = addExperience();
    setActiveEntryId(newId);
  };

  return (
    <FormSection 
      title="Doświadczenie Zawodowe" 
      description="Wymień swoje poprzednie stanowiska, zaczynając od najnowszego."
      onRemove={() => toggleSection('Doświadczenie')}
    >
      <div className="accordion-container">
        {cvData.experience.map((entry) => {
          const title = (entry.position || entry.company)
            ? `${entry.position || '(Stanowisko)'} w ${entry.company || '(Firma)'}`
            : "Nowe doświadczenie";

          return (
            <AccordionEntry
              key={entry.id}
              title={title}
              isOpen={activeEntryId === entry.id}
              onToggle={() => setActiveEntryId(activeEntryId === entry.id ? null : entry.id)}
              onDelete={() => removeExperience(entry.id)}
            >
              <div className="form-group-row">
                <FormField
                  label="Stanowisko"
                  id={`pos-${entry.id}`}
                  value={entry.position}
                  onChange={(e) => updateExperience(entry.id, 'position', e.target.value)}
                  placeholder="np. Senior Frontend Developer"
                />
                <FormField
                  label="Firma"
                  id={`comp-${entry.id}`}
                  value={entry.company}
                  onChange={(e) => updateExperience(entry.id, 'company', e.target.value)}
                  placeholder="np. Google"
                />
              </div>

              <FormField
                label="Lokalizacja"
                id={`exp-loc-${entry.id}`}
                value={entry.location}
                onChange={(e) => updateExperience(entry.id, 'location', e.target.value)}
                placeholder="np. Kraków (lub Zdalnie)"
              />

              <div className="form-group-row">
                <FormDatePicker
                  label="Data rozpoczęcia"
                  id={`exp-start-${entry.id}`}
                  selected={entry.startDate}
                  onChange={(val) => updateExperience(entry.id, 'startDate', val)}
                />
                <FormDatePicker
                  label="Data zakończenia"
                  id={`exp-end-${entry.id}`}
                  selected={entry.endDate}
                  disabled={entry.currentlyWorking}
                  onChange={(val) => updateExperience(entry.id, 'endDate', val)}
                  placeholder={entry.currentlyWorking ? "Obecnie" : "mm / rrrr"}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.currentlyWorking}
                    onChange={() => updateExperience(entry.id, 'currentlyWorking', !entry.currentlyWorking)}
                  />
                  <span>Obecnie pracuję na tym stanowisku</span>
                </label>
              </div>

              <FormField
                label="Podsumowanie (Opis obowiązków)"
                id={`exp-desc-${entry.id}`}
                type="textarea"
                rows="5"
                value={entry.summary}
                onChange={(e) => updateExperience(entry.id, 'summary', e.target.value)}
                placeholder="Np. Rozwój interfejsów użytkownika w React, optymalizacja wydajności aplikacji, współpraca z zespołem UX/UI..."
              />
            </AccordionEntry>
          );
        })}
      </div>

      <button type="button" className="btn-add" onClick={handleAdd}>
        + Dodaj doświadczenie
      </button>
    </FormSection>
  );
};

export default ExperienceForm;