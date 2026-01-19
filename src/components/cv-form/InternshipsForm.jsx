import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import AccordionEntry from '../ui/AccordionEntry';
import FormField from '../ui/FormField';
import FormDatePicker from '../ui/FormDatePicker';
import './FormStyles.css';

const InternshipsForm = () => {
  const { 
    cvData, 
    addInternship, 
    removeInternship, 
    updateInternship, 
    toggleSection 
  } = useCV();
  
  const [activeEntryId, setActiveEntryId] = useState(null);

  const handleAdd = () => {
    const newId = addInternship();
    setActiveEntryId(newId);
  };

  return (
    <FormSection 
      title="Staże i praktyki" 
      description="Wymień swoje staże lub praktyki, zaczynając od najnowszego."
      onRemove={() => toggleSection('Staże')}
    >
      <div className="accordion-container">
        {cvData.internships.map((entry) => {
          const title = (entry.position || entry.company)
            ? `${entry.position || '(Stanowisko)'} w ${entry.company || '(Firma)'}`
            : "Nowy staż";

          return (
            <AccordionEntry
              key={entry.id}
              title={title}
              isOpen={activeEntryId === entry.id}
              onToggle={() => setActiveEntryId(activeEntryId === entry.id ? null : entry.id)}
              onDelete={() => removeInternship(entry.id)}
            >
              <div className="form-group-row">
                <FormField
                  label="Stanowisko"
                  id={`int-pos-${entry.id}`}
                  value={entry.position}
                  onChange={(e) => updateInternship(entry.id, 'position', e.target.value)}
                  placeholder="Np. Stażysta Frontend Developer"
                />
                <FormField
                  label="Firma"
                  id={`int-comp-${entry.id}`}
                  value={entry.company}
                  onChange={(e) => updateInternship(entry.id, 'company', e.target.value)}
                  placeholder="Nazwa firmy"
                />
              </div>

              <FormField
                label="Lokalizacja"
                id={`int-loc-${entry.id}`}
                value={entry.location}
                onChange={(e) => updateInternship(entry.id, 'location', e.target.value)}
                placeholder="Miasto"
              />

              <div className="form-group-row">
                <FormDatePicker
                  label="Data rozpoczęcia"
                  id={`int-start-${entry.id}`}
                  selected={entry.startDate}
                  onChange={(val) => updateInternship(entry.id, 'startDate', val)}
                />
                <FormDatePicker
                  label="Data końcowa"
                  id={`int-end-${entry.id}`}
                  selected={entry.endDate}
                  disabled={entry.currentlyWorking}
                  onChange={(val) => updateInternship(entry.id, 'endDate', val)}
                  placeholder={entry.currentlyWorking ? "Obecnie" : "mm / rrrr"}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.currentlyWorking}
                    onChange={() => updateInternship(entry.id, 'currentlyWorking', !entry.currentlyWorking)}
                  />
                  <span>Obecnie odbywam ten staż</span>
                </label>
              </div>

              <FormField
                label="Podsumowanie (Opis obowiązków)"
                id={`int-desc-${entry.id}`}
                type="textarea"
                rows="4"
                value={entry.summary}
                onChange={(e) => updateInternship(entry.id, 'summary', e.target.value)}
                placeholder="Np. Wsparcie zespołu w tworzeniu komponentów UI, nauka frameworka React..."
              />
            </AccordionEntry>
          );
        })}
      </div>

      <button type="button" className="btn-add" onClick={handleAdd}>
        + Dodaj staż
      </button>
    </FormSection>
  );
};

export default InternshipsForm;