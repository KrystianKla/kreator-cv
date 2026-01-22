import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import AccordionEntry from '../ui/AccordionEntry';
import FormField from '../ui/FormField';
import FormDatePicker from '../ui/FormDatePicker';
import './FormStyles.css';

const EducationForm = () => {
  const { cvData, addEducation, removeEducation, updateEducation, toggleSection } = useCV();
  const [activeEntryId, setActiveEntryId] = useState(null);

  const handleAdd = () => {
    const newId = addEducation();
    setActiveEntryId(newId);
  };

  return (
    <FormSection 
      title="Edukacja" 
      description="Wymień szkoły wyższe, średnie lub inne ważne etapy Twojej edukacji."
      onRemove={() => toggleSection('Edukacja')}
    >
      <div className="accordion-container">
        {cvData.education.map((entry) => {
          const title = (entry.school || entry.degree)
            ? `${entry.school || '(Szkoła)'}${entry.degree ? ' - ' + entry.degree : ''}`
            : "Nowa edukacja";

          return (
            <AccordionEntry
              key={entry.id}
              title={title}
              isOpen={activeEntryId === entry.id}
              onToggle={() => setActiveEntryId(activeEntryId === entry.id ? null : entry.id)}
              onDelete={() => removeEducation(entry.id)}
            >
              <div className="form-group-row">
                <FormField
                  label="Nazwa szkoły / uczelni"
                  id={`school-${entry.id}`}
                  value={entry.school}
                  onChange={(e) => updateEducation(entry.id, 'school', e.target.value)}
                  placeholder="np. Uniwersytet Warszawski"
                />
                <FormField
                  label="Kierunek / Stopień"
                  id={`degree-${entry.id}`}
                  value={entry.degree}
                  onChange={(e) => updateEducation(entry.id, 'degree', e.target.value)}
                  placeholder="np. Magister Informatyki"
                />
              </div>

              <FormField
                label="Miasto"
                id={`edu-city-${entry.id}`}
                value={entry.city}
                onChange={(e) => updateEducation(entry.id, 'city', e.target.value)}
                placeholder="np. Warszawa"
              />

              <div className="form-group-row">
                <FormDatePicker
                  label="Data rozpoczęcia"
                  id={`edu-start-${entry.id}`}
                  selected={entry.startDate}
                  onChange={(val) => updateEducation(entry.id, 'startDate', val)}
                />
                <FormDatePicker
                  label="Data zakończenia"
                  id={`edu-end-${entry.id}`}
                  selected={entry.endDate}
                  disabled={entry.currentlyStudying}
                  onChange={(val) => updateEducation(entry.id, 'endDate', val)}
                  placeholder={entry.currentlyStudying ? "Obecnie" : "mm / rrrr"}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={entry.currentlyStudying}
                    onChange={() => updateEducation(entry.id, 'currentlyStudying', !entry.currentlyStudying)}
                  />
                  <span>Nadal studiuję / W trakcie</span>
                </label>
              </div>

              <FormField
                label="Opis / Osiągnięcia (opcjonalnie)"
                id={`edu-desc-${entry.id}`}
                type="textarea"
                rows="3"
                value={entry.summary}
                onChange={(e) => updateEducation(entry.id, 'summary', e.target.value)}
                placeholder="Np. wybrane przedmioty, temat pracy dyplomowej, stypendia..."
              />
            </AccordionEntry>
          );
        })}
      </div>

      <button type="button" className="btn-add" onClick={handleAdd}>
        + Dodaj edukację
      </button>
    </FormSection>
  );
};

export default EducationForm;