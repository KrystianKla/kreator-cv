import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Generujemy listę lat (np. od teraz do 1970)
// EN: Generate a list of years (e.g., from now until 1970)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i));

// PL: Komponent formularza dla sekcji "Certyfikaty".
// EN: Form component for the "Certificates" section.
const CertificatesForm = () => {
    // PL: Pobranie stanu i funkcji z globalnego kontekstu CV
    // EN: Get state and functions from the global CV context
    const { cvData, addCertificate, removeCertificate, updateCertificate, toggleSection } = useCV();

    // PL: Stan lokalny do śledzenia, który wpis akordeonu jest otwarty
    // EN: Local state to track which accordion entry is open
    const [activeEntryId, setActiveEntryId] = useState(null);

    // PL: Handler do aktualizacji pól formularza w globalnym stanie
    // EN: Handler to update form fields in the global state
    const handleChange = (id, e) => {
        updateCertificate(id, e.target.name, e.target.value);
    };

    // PL: Handler dodający nowy certyfikat i otwierający go do edycji
    // EN: Handler to add a new certificate and open it for editing
    const handleAdd = () => {
        const newId = addCertificate();
        setActiveEntryId(newId);
    };

    // PL: Handler do przełączania (otwierania/zamykania) wpisu w akordeonie
    // EN: Handler to toggle (open/close) an accordion entry
    const toggleEntry = (id) => {
        setActiveEntryId(activeEntryId === id ? null : id);
    };

    return (
        <fieldset className="form-section">
            <legend>
                Certyfikaty
                <button
                    type="button"
                    className="btn-remove-section"
                    title="Ukryj tę sekcję"
                    onClick={() => toggleSection('Certyfikaty')}
                >
                    ×
                </button>
            </legend>

            <div className="accordion-container">
                {cvData.certificates.map((entry) => {
                    const isOpen = activeEntryId === entry.id;
                    const title = entry.name || "Nowy certyfikat";

                    return (
                        <div key={entry.id} className="form-entry-accordion">
                            <div className="form-entry-header" onClick={() => toggleEntry(entry.id)}>
                                <span className="form-entry-title">{title}</span>
                                <div className="form-entry-controls">
                                    <button type="button" className="btn-delete-minimal" onClick={(e) => { e.stopPropagation(); removeCertificate(entry.id); }}>
                                        Usuń
                                    </button>
                                    <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="form-entry-content">
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label htmlFor={`cert-name-${entry.id}`}>Nazwa certyfikatu</label>
                                            <input
                                                type="text"
                                                id={`cert-name-${entry.id}`}
                                                name="name"
                                                value={entry.name}
                                                onChange={(e) => handleChange(entry.id, e)}
                                                placeholder="np. AWS Certified Cloud Practitioner"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={`cert-year-${entry.id}`}>Rok ukończenia</label>
                                            <select
                                                id={`cert-year-${entry.id}`}
                                                name="year"
                                                value={entry.year}
                                                onChange={(e) => handleChange(entry.id, e)}
                                                className="form-select"
                                            >
                                                <option value="" disabled>Rok...</option>
                                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor={`cert-desc-${entry.id}`}>Opis (opcjonalnie)</label>
                                        <textarea
                                            id={`cert-desc-${entry.id}`}
                                            name="description"
                                            rows="2"
                                            value={entry.description}
                                            onChange={(e) => handleChange(entry.id, e)}
                                            placeholder="Krótki opis, czego dotyczył certyfikat"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button type="button" className="btn-add" onClick={handleAdd}>
                + Dodaj certyfikat
            </button>
        </fieldset>
    );
};

export default CertificatesForm;