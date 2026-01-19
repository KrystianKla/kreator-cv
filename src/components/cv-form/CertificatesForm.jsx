import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import AccordionEntry from '../ui/AccordionEntry';
import FormField from '../ui/FormField';
import './FormStyles.css';

const CertificatesForm = () => {
    const { cvData, addCertificate, removeCertificate, updateCertificate, toggleSection } = useCV();
    const [activeEntryId, setActiveEntryId] = useState(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

    const handleAdd = () => {
        const newId = addCertificate();
        setActiveEntryId(newId);
    };


    return (
        <FormSection
            title="Certyfikaty"
            onRemove={() => toggleSection('Certyfikaty')}
        >
            <div className="accordion-container">
                {cvData.certificates.map((entry) => (
                    <AccordionEntry
                        key={entry.id}
                        title={entry.name || "Nowy certyfikat"}
                        isOpen={activeEntryId === entry.id}
                        onToggle={() => setActiveEntryId(activeEntryId === entry.id ? null : entry.id)}
                        onDelete={() => removeCertificate(entry.id)}
                    >
                        <div className="form-group-row">
                            <FormField
                                label="Nazwa certyfikatu"
                                id={`cert-name-${entry.id}`}
                                value={entry.name}
                                onChange={(e) => updateCertificate(entry.id, 'name', e.target.value)}
                                placeholder="np. AWS Certified Cloud Practitioner"
                            />

                            <div className="form-group">
                                <label htmlFor={`cert-year-${entry.id}`}>Rok ukończenia</label>
                                <select
                                    id={`cert-year-${entry.id}`}
                                    value={entry.year}
                                    onChange={(e) => updateCertificate(entry.id, 'year', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="" disabled>Rok...</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <FormField
                            label="Opis (opcjonalnie)"
                            id={`cert-desc-${entry.id}`}
                            type="textarea"
                            rows="2"
                            value={entry.description}
                            onChange={(e) => updateCertificate(entry.id, 'description', e.target.value)}
                            placeholder="Krótki opis, czego dotyczył certyfikat"
                        />
                    </AccordionEntry>
                ))}
            </div>

            <button type="button" className="btn-add" onClick={handleAdd}>
                + Dodaj certyfikat
            </button>
        </FormSection>
    );
};

export default CertificatesForm;