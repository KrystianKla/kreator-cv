import React, { useRef } from 'react';
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

const EditorPage = () => {
  const { cvData } = useCV();
  const componentToPrintRef = useRef(null);
  if (!cvData) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Ładowanie Twoich danych...</h2>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <div className="editor-form-column">
        <h2>Uzupełnij swoje dane</h2>

        <button
          onClick={() => window.print()}
          type="button"
          className="btn-print"
        >
          Pobierz / Drukuj CV
        </button>

        <PersonalDetailsForm />
        <ProfileSummaryForm />
        <ExperienceForm />
        <EducationForm />
        <SkillsForm />

        <ExtraSectionsForm />

        {cvData.sections?.['Kursy'] && <CoursesForm />}
        {cvData.sections?.['Certyfikaty'] && <CertificatesForm />}
        {cvData.sections?.['Staże'] && <InternshipsForm />}
        {cvData.sections?.['Języki'] && <LanguagesForm />}
        {cvData.sections?.['Media społecznościowe'] && <SocialsForm />}
        {cvData.sections?.['Zainteresowania'] && <HobbiesForm />}
      </div>

      <div className="editor-preview-column">
        <h2>Podgląd CV</h2>
        <div className="cv-preview-wrapper">
          <div ref={componentToPrintRef}>
            <CVTemplate />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;