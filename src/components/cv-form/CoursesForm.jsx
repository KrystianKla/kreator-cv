import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import AccordionEntry from '../ui/AccordionEntry';
import FormField from '../ui/FormField';
import FormDatePicker from '../ui/FormDatePicker';
import './FormStyles.css';

const CoursesForm = () => {
    const { cvData, addCourse, removeCourse, updateCourse, toggleSection } = useCV();
    const [activeEntryId, setActiveEntryId] = useState(null);

    const handleAdd = () => {
        const newId = addCourse();
        setActiveEntryId(newId);
    };

    return (
        <FormSection
            title="Kursy"
            description="Wymień ukończone kursy, szkolenia lub warsztaty."
            onRemove={() => toggleSection('Kursy')}
        >
            <div className="accordion-container">
                {cvData.courses.map((entry) => {
                    const title = (entry.courseName || entry.provider)
                        ? `${entry.courseName || '(Nazwa kursu)'} przez ${entry.provider || '(Prowadzący)'}`
                        : "Nowy kurs";

                    return (
                        <AccordionEntry
                            key={entry.id}
                            title={title}
                            isOpen={activeEntryId === entry.id}
                            onToggle={() => setActiveEntryId(activeEntryId === entry.id ? null : entry.id)}
                            onDelete={() => removeCourse(entry.id)}
                        >
                            <div className="form-group-row">
                                <FormField
                                    label="Nazwa kursu"
                                    id={`course-name-${entry.id}`}
                                    value={entry.courseName}
                                    onChange={(e) => updateCourse(entry.id, 'courseName', e.target.value)}
                                    placeholder="Kurs React od A do Z"
                                />
                                <FormField
                                    label="Prowadzony przez"
                                    id={`provider-${entry.id}`}
                                    value={entry.provider}
                                    onChange={(e) => updateCourse(entry.id, 'provider', e.target.value)}
                                    placeholder="Udemy"
                                />
                            </div>

                            <FormField
                                label="Lokalizacja (opcjonalnie)"
                                id={`location-${entry.id}`}
                                value={entry.location}
                                onChange={(e) => updateCourse(entry.id, 'location', e.target.value)}
                                placeholder="Online"
                            />

                            <div className="form-group-row">
                                <FormDatePicker
                                    label="Data rozpoczęcia"
                                    id={`startDate-${entry.id}`}
                                    selected={entry.startDate}
                                    onChange={(val) => updateCourse(entry.id, 'startDate', val)}
                                />
                                <FormDatePicker
                                    label="Data końcowa"
                                    id={`endDate-${entry.id}`}
                                    selected={entry.endDate}
                                    onChange={(val) => updateCourse(entry.id, 'endDate', val)}
                                />
                            </div>

                            <FormField
                                label="Podsumowanie (opcjonalnie)"
                                id={`summary-${entry.id}`}
                                type="textarea"
                                rows="4"
                                value={entry.summary}
                                onChange={(e) => updateCourse(entry.id, 'summary', e.target.value)}
                                placeholder="Np. Czego dotyczył kurs, jakie technologie zostały użyte..."
                            />
                        </AccordionEntry>
                    );
                })}
            </div>

            <button type="button" className="btn-add" onClick={handleAdd}>
                + Dodaj kurs
            </button>
        </FormSection>
    );
};

export default CoursesForm;