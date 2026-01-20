import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import ToggleButton from '../ui/ToggleButton';
import './FormStyles.css';

const allAvailableSections = [
  'Zainteresowania',
  'Kursy',
  'Języki',
  'Staże',
  'Certyfikaty',
  'Media społecznościowe',
];

const ExtraSectionsForm = () => {
  const { cvData, toggleSection } = useCV();

  return (
    <FormSection
      title="Dodatkowe informacje"
      description="Kliknij, aby włączyć lub wyłączyć dodatkowe sekcje w swoim CV."
    >
      <div className="section-adder-grid">
        {allAvailableSections.map(name => (
          <ToggleButton
            key={name}
            label={name}
            isActive={cvData?.sections?.[name] || false}
            onClick={() => toggleSection(name)}
          />
        ))}
      </div>
    </FormSection>
  );
};

export default ExtraSectionsForm;