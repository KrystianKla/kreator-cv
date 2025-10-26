import React, { createContext, useContext, useState } from 'react';

// PL: Domyślna struktura danych CV używana przy inicjalizacji stanu.
// EN: Default CV data structure used for state initialization.

const defaultCVData = {
  personal: {
    photo: "", firstName: "", lastName: "", position: "", email: "",
    phone: "", address: "", postalCode: "", city: "",
    drivingLicense: [], sex: "", dob: "", pob: "",
    nationality: "", maritalStatus: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  courses: [],
  certificates: [],
  internships: [],
  languages: [],
  socials: [],
  hobbies: "",
  // PL: Stan aktywności poszczególnych dodatkowych sekcji
  // EN: State tracking the activity of individual extra sections
  sections: {
    'Zainteresowania': false,
    'Kursy': false,
    'Języki': false,
    'Staże': false,
    'Certyfikaty': false,
    'Media społecznościowe': false,
  }
};

const CVContext = createContext();

// PL: Komponent Providera kontekstu CV. Przechowuje stan `cvData` i udostępnia funkcje do jego modyfikacji.
// EN: CV Context Provider component. Holds the `cvData` state and provides functions to modify it.

export const CVProvider = ({ children }) => {
  const [cvData, setCvData] = useState(defaultCVData);

  // --- Personal Details & Summary ---
  /**
   * PL: Aktualizuje pojedyncze pole w sekcji danych osobowych.
   * EN: Updates a single field in the personal details section.
   */
  const updatePersonal = (field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      personal: { ...prevData.personal, [field]: value },
    }));
  };
  /**
   * PL: Aktualizuje tekst profilu zawodowego.
   * EN: Updates the profile summary text.
   */
  const updateSummary = (value) => {
    setCvData((prevData) => ({ ...prevData, summary: value }));
  };

  // --- Work Experience ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji doświadczenia zawodowego.
   * EN: Adds a new, empty entry to the work experience section.
   * @returns {number} ID nowo dodanego wpisu / ID of the newly added entry
   */
  const addExperience = () => {
    const newId = Date.now();
    const newEntry = {
      id: newId, position: "", company: "", location: "",
      startDate: "", endDate: "", currentlyWorking: false, summary: "",
    };
    setCvData((prevData) => ({
      ...prevData,
      experience: [...prevData.experience, newEntry],
    }));
    return newId;
  };
  /**
   * PL: Usuwa wpis doświadczenia o podanym ID.
   * EN: Removes the experience entry with the specified ID.
   */
  const removeExperience = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje konkretne pole we wpisie doświadczenia o podanym ID.
   * EN: Updates a specific field in the experience entry with the specified ID.
   */
  const updateExperience = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      experience: prevData.experience.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };
  /**
   * PL: Przełącza status "Obecnie pracuję" dla wpisu doświadczenia i czyści datę końcową, jeśli jest zaznaczone.
   * EN: Toggles the "Currently working" status for an experience entry and clears the end date if checked.
   */
  const toggleExperienceCurrentlyWorking = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      experience: prevData.experience.map((entry) =>
        entry.id === id
          ? {
            ...entry,
            currentlyWorking: !entry.currentlyWorking,
            endDate: !entry.currentlyWorking ? "" : entry.endDate,
          }
          : entry
      ),
    }));
  };

  // --- Education ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji edukacji.
   * EN: Adds a new, empty entry to the education section.
   * @returns {number} ID nowo dodanego wpisu / ID of the newly added entry
   */
  const addEducation = () => {
    const newId = Date.now();
    const newEntry = {
      id: newId, degree: "", institution: "", location: "",
      startDate: "", endDate: "", currentlyStudying: false, summary: "",
    };
    setCvData((prevData) => ({
      ...prevData,
      education: [...prevData.education, newEntry],
    }));
    return newId;
  };
  /**
   * PL: Usuwa wpis edukacji o podanym ID.
   * EN: Removes the education entry with the specified ID.
   */
  const removeEducation = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje konkretne pole we wpisie edukacji o podanym ID.
   * EN: Updates a specific field in the education entry with the specified ID.
   */
  const updateEducation = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      education: prevData.education.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };
  /**
   * PL: Przełącza status "Obecnie studiuję" dla wpisu edukacji i czyści datę końcową, jeśli jest zaznaczone.
   * EN: Toggles the "Currently studying" status for an education entry and clears the end date if checked.
   */
  const toggleEducationCurrentlyStudying = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      education: prevData.education.map((entry) =>
        entry.id === id
          ? {
            ...entry,
            currentlyStudying: !entry.currentlyStudying,
            endDate: !entry.currentlyStudying ? "" : entry.endDate,
          }
          : entry
      ),
    }));
  };

  // --- Skills ---
  /**
   * PL: Dodaje nową, pustą umiejętność (z domyślnym poziomem).
   * EN: Adds a new, empty skill (with a default level).
   */
  const addSkill = () => {
    const newEntry = { id: Date.now(), name: "", level: 3 };
    setCvData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, newEntry],
    }));
  };
  /**
   * PL: Usuwa umiejętność o podanym ID.
   * EN: Removes the skill with the specified ID.
   */
  const removeSkill = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje nazwę lub poziom umiejętności o podanym ID.
   * EN: Updates the name or level of the skill with the specified ID.
   */
  const updateSkill = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  // --- Courses ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji kursów.
   * EN: Adds a new, empty entry to the courses section.
   * @returns {number} ID nowo dodanego wpisu / ID of the newly added entry
   */
  const addCourse = () => {
    const newId = Date.now();
    const newEntry = {
      id: newId, courseName: "", provider: "", startDate: "", endDate: "", summary: "",
    };
    setCvData((prevData) => ({
      ...prevData,
      courses: [...prevData.courses, newEntry],
    }));
    return newId;
  };
  /**
   * PL: Usuwa kurs o podanym ID.
   * EN: Removes the course with the specified ID.
   */
  const removeCourse = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      courses: prevData.courses.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje konkretne pole we wpisie kursu o podanym ID.
   * EN: Updates a specific field in the course entry with the specified ID.
   */
  const updateCourse = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      courses: prevData.courses.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // --- Certificates ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji certyfikatów.
   * EN: Adds a new, empty entry to the certificates section.
   * @returns {number} ID nowo dodanego wpisu / ID of the newly added entry
   */
  const addCertificate = () => {
    const newId = Date.now();
    const newEntry = { id: newId, name: "", year: "", description: "" };
    setCvData((prevData) => ({
      ...prevData,
      certificates: [...prevData.certificates, newEntry],
    }));
    return newId;
  };
  /**
   * PL: Usuwa certyfikat o podanym ID.
   * EN: Removes the certificate with the specified ID.
   */
  const removeCertificate = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      certificates: prevData.certificates.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje konkretne pole we wpisie certyfikatu o podanym ID.
   * EN: Updates a specific field in the certificate entry with the specified ID.
   */
  const updateCertificate = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      certificates: prevData.certificates.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // --- Section Toggling ---
  /**
   * PL: Przełącza widoczność (aktywność) dodatkowej sekcji CV.
   * EN: Toggles the visibility (activity) of an extra CV section.
   */
  const toggleSection = (sectionName) => {
    setCvData((prevData) => ({
      ...prevData,
      sections: {
        ...prevData.sections,
        [sectionName]: !prevData.sections[sectionName], // Toggle boolean value
      },
    }));
  };

  // --- Internships ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji staży.
   * EN: Adds a new, empty entry to the internships section.
   * @returns {number} ID nowo dodanego wpisu / ID of the newly added entry
   */
  const addInternship = () => {
    const newId = Date.now();
    const newEntry = {
      id: newId, position: "", company: "", location: "",
      startDate: "", endDate: "", currentlyWorking: false, summary: "",
    };
    setCvData((prevData) => ({
      ...prevData,
      internships: [...prevData.internships, newEntry],
    }));
    return newId;
  };
  /**
   * PL: Usuwa staż o podanym ID.
   * EN: Removes the internship with the specified ID.
   */
  const removeInternship = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      internships: prevData.internships.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje konkretne pole we wpisie stażu o podanym ID.
   * EN: Updates a specific field in the internship entry with the specified ID.
   */
  const updateInternship = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      internships: prevData.internships.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };
  /**
   * PL: Przełącza status "Obecnie odbywam" dla wpisu stażu i czyści datę końcową, jeśli jest zaznaczone.
   * EN: Toggles the "Currently working" status for an internship entry and clears the end date if checked.
   */
  const toggleInternshipCurrentlyWorking = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      internships: prevData.internships.map((entry) =>
        entry.id === id
          ? {
            ...entry,
            currentlyWorking: !entry.currentlyWorking,
            endDate: !entry.currentlyWorking ? "" : entry.endDate,
          }
          : entry
      ),
    }));
  };

  // --- Languages ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji języków (z domyślnym poziomem).
   * EN: Adds a new, empty entry to the languages section (with a default level).
   */
  const addLanguage = () => {
    const newEntry = { id: Date.now(), name: "", level: "Biegły" }; // Default level
    setCvData((prevData) => ({
      ...prevData,
      languages: [...prevData.languages, newEntry],
    }));
  };
  /**
   * PL: Usuwa język o podanym ID.
   * EN: Removes the language with the specified ID.
   */
  const removeLanguage = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje nazwę lub poziom języka o podanym ID.
   * EN: Updates the name or level of the language with the specified ID.
   */
  const updateLanguage = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      languages: prevData.languages.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // --- Social Media / Links ---
  /**
   * PL: Dodaje nowy, pusty wpis do sekcji mediów społecznościowych/linków.
   * EN: Adds a new, empty entry to the social media/links section.
   */
  const addSocial = () => {
    const newEntry = { id: Date.now(), label: "", url: "" };
    setCvData((prevData) => ({
      ...prevData,
      socials: [...prevData.socials, newEntry],
    }));
  };
  /**
   * PL: Usuwa link o podanym ID.
   * EN: Removes the link with the specified ID.
   */
  const removeSocial = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      socials: prevData.socials.filter((entry) => entry.id !== id),
    }));
  };
  /**
   * PL: Aktualizuje etykietę lub URL linku o podanym ID.
   * EN: Updates the label or URL of the link with the specified ID.
   */
  const updateSocial = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      socials: prevData.socials.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // --- Hobbies ---
  /**
   * PL: Aktualizuje tekst sekcji zainteresowań.
   * EN: Updates the hobbies section text.
   */
  const updateHobbies = (value) => {
    setCvData((prevData) => ({
      ...prevData,
      hobbies: value,
    }));
  };

  // PL: Obiekt wartości przekazywany przez Providera do komponentów potomnych
  // EN: Value object passed down by the Provider to child components
  const value = {
    cvData,
    updatePersonal,
    updateSummary,
    addExperience,
    removeExperience,
    updateExperience,
    toggleExperienceCurrentlyWorking,
    addEducation,
    removeEducation,
    updateEducation,
    toggleEducationCurrentlyStudying,
    addSkill,
    removeSkill,
    updateSkill,
    addCourse,
    removeCourse,
    updateCourse,
    addCertificate,
    removeCertificate,
    updateCertificate,
    toggleSection,
    addInternship,
    removeInternship,
    updateInternship,
    toggleInternshipCurrentlyWorking,
    addLanguage,
    removeLanguage,
    updateLanguage,
    addSocial,
    removeSocial,
    updateSocial,
    updateHobbies,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

/**
 * PL: Niestandardowy hook ułatwiający dostęp do kontekstu CV.
 * EN: Custom hook to easily access the CV context.
 */
export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    // PL: Błąd rzucany, jeśli hook jest używany poza Providerem
    // EN: Error thrown if the hook is used outside of the Provider
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};