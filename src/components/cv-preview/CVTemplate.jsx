import React from 'react';
import { useCV } from '../../context/CVContext';
import './CVTemplate.css';

const CVTemplate = () => {
  const { cvData } = useCV();
  const { personal, summary } = cvData;

  const formatDisplayPhone = (phone) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    const parts = cleanPhone.match(/.{1,3}/g);
    return parts ? parts.join('-') : cleanPhone;
  };

  const formatDisplayPostalCode = (code) => {
    if (!code) return '';
    const clean = code.replace(/\D/g, '').slice(0, 5);
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}-${clean.slice(2, 5)}`;
    }
    return clean;
  };

  /**
   * @param {string} dateString - Data w formacie ISO (YYYY-MM-DD) / Date in ISO format (YYYY-MM-DD)
   * @returns {string | null} Sformatowana data lub null / Formatted date or null
   */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pl-PL');
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  /**
   * @param {string} dateString - Data w formacie ISO (YYYY-MM-DD) / Date in ISO format (YYYY-MM-DD)
   * @param {boolean} currentlyWorking - Czy to aktualna pozycja? / Is this the current position?
   * @param {string} dateFormat - Opcjonalny format ('month-year' lub 'year-only') / Optional format ('month-year' or 'year-only') - Currently not used here but kept for potential future use
   * @returns {string} Sformatowana data / Formatted date
   */
  const formatMonthYear = (dateString, currentlyWorking = false, dateFormat = 'month-year') => {
    if (currentlyWorking) return "Obecnie";
    if (!dateString) return "Data";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
      });
    } catch (e) {
      console.error("Error formatting month/year:", e);
      return dateString;
    }
  };

  return (
    <div className="cv-preview-page">
      <header className="cv-header">
        {personal.photo && (
          <img src={personal.photo} alt="Zdjęcie profilowe" className="cv-photo" />
        )}
        <div className="cv-header-info">
          <h1>
            {personal.firstName || 'Imię'} {personal.lastName || 'Nazwisko'}
          </h1>
          <p className="cv-position">
            {personal.position || 'Twoje Stanowisko'}
          </p>
        </div>
      </header>

      <main className="cv-body">
        <aside className="cv-sidebar">
          <h3>Dane Osobowe</h3>
          <ul className="cv-contact-list">
            {personal.email && <li>📧 {personal.email}</li>}
            {personal.phone && <li>📞 {personal.countryCode || '+48'} {formatDisplayPhone(personal.phone)}</li>}
            {(personal.address || personal.city) && (
              <li>
                📍 {personal.address}
                {personal.address && (personal.postalCode || personal.city) ? <br /> : ''}
                {formatDisplayPostalCode(personal.postalCode)} {personal.city}
              </li>
            )}
            {personal.dob && <li><b>Data urodzenia:</b> {formatDate(personal.dob)}</li>}
            {personal.pob && <li><b>Miejsce urodzenia:</b> {personal.pob}</li>}
            {personal.sex && <li><b>Płeć:</b> {personal.sex}</li>}
            {personal.nationality && <li><b>Narodowość:</b> {personal.nationality}</li>}
            {personal.maritalStatus && <li><b>Stan cywilny:</b> {personal.maritalStatus}</li>}
            {personal.drivingLicense.length > 0 && (
              <li><b>Prawo jazdy:</b> {personal.drivingLicense.join(', ')}</li>
            )}
          </ul>

          {cvData.socials && cvData.socials.length > 0 && (
            <div className="cv-sidebar-section" style={{ paddingTop: '1rem' }}>
              <h3>Linki</h3>
              <ul className="cv-links-list">
                {cvData.socials.map(social => (
                  <li key={social.id}>
                    <span>🔗</span>
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      {social.label || "Link"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cvData.skills && cvData.skills.length > 0 && (
            <div className="cv-sidebar-section">
              <h3>Umiejętności</h3>
              <ul className="cv-skills-list">
                {cvData.skills.map(skill => (
                  <li key={skill.id}>
                    <span className="skill-name">{skill.name || "Umiejętność"}</span>
                    <div className="skill-level-dots">
                      {[1, 2, 3, 4, 5].map(dot => (
                        <span
                          key={dot}
                          className={`dot ${dot <= skill.level ? 'filled' : ''}`}
                        ></span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cvData.languages && cvData.languages.length > 0 && (
            <div className="cv-sidebar-section">
              <h3>Języki</h3>
              <ul className="cv-language-list">
                {cvData.languages.map(lang => (
                  <li key={lang.id}>
                    <span className="language-name">{lang.name || "Język"}</span>
                    <span className="language-level">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cvData.hobbies && (
            <div className="cv-sidebar-section">
              <h3>Zainteresowania</h3>
              <p className="cv-hobbies-text">
                {cvData.hobbies}
              </p>
            </div>
          )}
        </aside>

        <section className="cv-main-content">
          {summary && (
            <div className="cv-section">
              <h3>Profil Osobisty</h3>
              <p className="cv-summary-text">{summary}</p>
            </div>
          )}

          {cvData.internships && cvData.internships.length > 0 && (
            <div className="cv-section">
              <h3>Staże</h3>
              {cvData.internships.map((internship) => (
                <div key={internship.id} className="cv-job-entry">
                  <div className="cv-job-header">
                    <h4 className="cv-job-position">{internship.position || "(Stanowisko)"}</h4>
                    <p className="cv-job-dates">
                      {formatMonthYear(internship.startDate, false)} - {formatMonthYear(internship.endDate, internship.currentlyWorking)}
                    </p>
                  </div>
                  <p className="cv-job-company">
                    {internship.company || "(Firma)"}
                    {internship.location && `, ${internship.location}`}
                  </p>
                  {internship.summary && (
                    <p className="cv-job-summary">{internship.summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {cvData.experience && cvData.experience.length > 0 ? (
            <div className="cv-section">
              <h3>Doświadczenie Zawodowe</h3>
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="cv-job-entry">
                  <div className="cv-job-header">
                    <h4 className="cv-job-position">{exp.position || "(Stanowisko)"}</h4>
                    <p className="cv-job-dates">
                      {formatMonthYear(exp.startDate, false)} - {formatMonthYear(exp.endDate, exp.currentlyWorking)}
                    </p>
                  </div>
                  <p className="cv-job-company">
                    {exp.company || "(Firma)"}
                    {exp.location && `, ${exp.location}`}
                  </p>
                  {exp.summary && (
                    <p className="cv-job-summary">{exp.summary}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="cv-section">
              <h3>Doświadczenie Zawodowe</h3>
              <p className="placeholder-text">(Miejsce na Twoje doświadczenie)</p>
            </div>
          )}

          {cvData.education && cvData.education.length > 0 ? (
            <div className="cv-section">
              <h3>Edukacja</h3>
              {cvData.education.map((edu) => (
                <div key={edu.id} className="cv-job-entry">
                  <div className="cv-job-header">
                    <h4 className="cv-job-position">{edu.degree || "(Kierunek)"}</h4>
                    <p className="cv-job-dates">
                      {formatMonthYear(edu.startDate, false)} - {formatMonthYear(edu.endDate, edu.currentlyStudying)}
                    </p>
                  </div>
                  <p className="cv-job-company">
                    {edu.school || "(Uczelnia)"}
                    {edu.city && `, ${edu.city}`}
                  </p>
                  {edu.summary && (
                    <p className="cv-job-summary">{edu.summary}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="cv-section">
              <h3>Edukacja</h3>
              <p className="placeholder-text">(Miejsce na Twoją edukację)</p>
            </div>
          )}

          {cvData.courses && cvData.courses.length > 0 && (
            <div className="cv-section">
              <h3>Kursy</h3>
              {cvData.courses.map((course) => (
                <div key={course.id} className="cv-job-entry">
                  <div className="cv-job-header">
                    <h4 className="cv-job-position">{course.courseName || "(Nazwa kursu)"}</h4>
                    <p className="cv-job-dates">
                      {formatMonthYear(course.startDate, false)} - {formatMonthYear(course.endDate)}
                    </p>
                  </div>
                  <p className="cv-job-company">
                    {course.provider || "(Prowadzący)"}
                    {course.location && `, ${course.location}`}
                  </p>
                  {course.summary && (
                    <p className="cv-job-summary">{course.summary}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {cvData.certificates && cvData.certificates.length > 0 && (
            <div className="cv-section">
              <h3>Certyfikaty</h3>
              {cvData.certificates.map((cert) => (
                <div key={cert.id} className="cv-job-entry">
                  <div className="cv-job-header">
                    <h4 className="cv-job-position">{cert.name || "(Nazwa certyfikatu)"}</h4>
                    <p className="cv-job-dates">
                      {cert.year || ""}
                    </p>
                  </div>
                  {cert.description && (
                    <p className="cv-job-summary">{cert.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  );
};

export default CVTemplate;