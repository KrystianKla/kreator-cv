import React from 'react';
import PersonalDetailsForm from '../components/cv-form/PersonalDetailsForm';
import ProfileSummaryForm from '../components/cv-form/ProfileSummaryForm';
import ExperienceForm from '../components/cv-form/ExperienceForm';
import EducationForm from '../components/cv-form/EducationForm';
import SkillsForm from '../components/cv-form/SkillsForm';
import ExtraSectionsForm from '../components/cv-form/ExtraSectionsForm';
import CVTemplate from '../components/cv-preview/CVTemplate';
import { useCV } from '../context/CVContext';
import CoursesForm from '../components/cv-form/CoursesForm';
import CertificatesForm from '../components/cv-form/CertificatesForm';
import InternshipsForm from '../components/cv-form/InternshipsForm';
import LanguagesForm from '../components/cv-form/LanguagesForm';
import SocialsForm from '../components/cv-form/SocialsForm';
import HobbiesForm from '../components/cv-form/HobbiesForm';

import './EditorPage.css';

// PL: Główny komponent strony edytora CV. Składa się z dwóch kolumn:
// formularzy po lewej i podglądu CV po prawej.
// EN: Main component for the CV editor page. Consists of two columns:
// forms on the left and CV preview on the right.

const EditorPage = () => {
  // PL: Pobranie aktualnych danych CV z globalnego kontekstu
  // EN: Get the current CV data from the global context
  const { cvData } = useCV();

  return (
    <div className="editor-layout">
      {/* PL: Lewa kolumna zawierająca wszystkie komponenty formularzy */}
      {/* EN: Left column containing all form components */}
      <div className="editor-form-column">
        <h2>Uzupełnij swoje dane</h2>

        {/* PL: Podstawowe sekcje formularza */}
        {/* EN: Basic form sections */}
        <PersonalDetailsForm />
        <ProfileSummaryForm />
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />

        {/* PL: Sekcja do zarządzania dodatkowymi sekcjami */}
        {/* EN: Section for managing extra sections */}
        <ExtraSectionsForm />

        {/*
          PL: Dynamiczne renderowanie dodatkowych sekcji na podstawie stanu w cvData.sections.
              Formularz danej sekcji jest wyświetlany tylko wtedy, gdy odpowiadająca mu flaga jest ustawiona na true.
          EN: Dynamic rendering of extra sections based on the state in cvData.sections.
              A section's form is displayed only if its corresponding flag is set to true.
        */}
        {cvData.sections['Kursy'] && <CoursesForm />}
        {cvData.sections['Certyfikaty'] && <CertificatesForm />}
        {cvData.sections['Staże'] && <InternshipsForm />}
        {cvData.sections['Języki'] && <LanguagesForm />}
        {cvData.sections['Media społecznościowe'] && <SocialsForm />}
        {cvData.sections['Zainteresowania'] && <HobbiesForm />}

      </div>

      {/* PL: Prawa kolumna zawierająca podgląd CV */}
      {/* EN: Right column containing the CV preview */}
      <div className="editor-preview-column">
        <h2>Podgląd CV</h2>
        <div className="cv-preview-wrapper">
          <CVTemplate />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;