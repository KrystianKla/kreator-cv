import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from "firebase/firestore";


const defaultCVData = {
  personal: {
    photo: "", firstName: "", lastName: "", position: "", email: "",
    phone: "", address: "", postalCode: "", city: "",
    drivingLicense: [], sex: "", dob: "", pob: "",
    nationality: "", maritalStatus: "", countryCode: '+48',
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

const mapProfileToCV = (profileData, authUser) => {
  const baseProfile = profileData || {};
  const personalData = baseProfile.personal || {};

  return {
    ...defaultCVData,
    summary: baseProfile.summary || defaultCVData.summary,
    hobbies: baseProfile.hobbies || defaultCVData.hobbies,
    experience: baseProfile.experience || [],
    education: baseProfile.education || [],
    skills: baseProfile.skills || [],
    personal: {
      ...defaultCVData.personal,
      ...personalData,
      email: authUser.email,
      photo: baseProfile.photo || authUser.photoURL,
      firstName: personalData.firstName || authUser.displayName || '',
      lastName: personalData.lastName || '',
    },
    sections: defaultCVData.sections
  };
};

export const CVProvider = ({ children }) => {
  const [cvData, setCvData] = useState(defaultCVData);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);

      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          const initialCV = mapProfileToCV(profileData, currentUser);
          setCvData(initialCV);
        } else {
          const initialCV = mapProfileToCV(null, currentUser);
          setCvData(initialCV);
        }
      }, (error) => {
        console.error("Błąd wczytywania danych profilu w czasie rzeczywistym:", error);
      });

      return () => unsubscribe();

    } else {
      setCvData(defaultCVData);
    }
  }, [currentUser]);

  const updatePersonal = (field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      personal: { ...prevData.personal, [field]: value },
    }));
  };

  const updateSummary = (value) => {
    setCvData((prevData) => ({ ...prevData, summary: value }));
  };

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

  const removeExperience = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((entry) => entry.id !== id),
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      experience: prevData.experience.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

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

  const removeEducation = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((entry) => entry.id !== id),
    }));
  };

  const updateEducation = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      education: prevData.education.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

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

  const addSkill = () => {
    const newEntry = { id: Date.now(), name: "", level: 3 };
    setCvData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, newEntry],
    }));
  };

  const removeSkill = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill.id !== id),
    }));
  };

  const updateSkill = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

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

  const removeCourse = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      courses: prevData.courses.filter((entry) => entry.id !== id),
    }));
  };

  const updateCourse = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      courses: prevData.courses.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addCertificate = () => {
    const newId = Date.now();
    const newEntry = { id: newId, name: "", year: "", description: "" };
    setCvData((prevData) => ({
      ...prevData,
      certificates: [...prevData.certificates, newEntry],
    }));
    return newId;
  };

  const removeCertificate = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      certificates: prevData.certificates.filter((entry) => entry.id !== id),
    }));
  };

  const updateCertificate = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      certificates: prevData.certificates.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const toggleSection = (sectionName) => {
    setCvData((prevData) => ({
      ...prevData,
      sections: {
        ...prevData.sections,
        [sectionName]: !prevData.sections[sectionName],
      },
    }));
  };

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

  const removeInternship = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      internships: prevData.internships.filter((entry) => entry.id !== id),
    }));
  };

  const updateInternship = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      internships: prevData.internships.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

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

  const addLanguage = () => {
    const newEntry = { id: Date.now(), name: "", level: "Biegły" };
    setCvData((prevData) => ({
      ...prevData,
      languages: [...prevData.languages, newEntry],
    }));
  };

  const removeLanguage = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter((entry) => entry.id !== id),
    }));
  };

  const updateLanguage = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      languages: prevData.languages.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addSocial = () => {
    const newEntry = { id: Date.now(), label: "", url: "" };
    setCvData((prevData) => ({
      ...prevData,
      socials: [...prevData.socials, newEntry],
    }));
  };

  const removeSocial = (id) => {
    setCvData((prevData) => ({
      ...prevData,
      socials: prevData.socials.filter((entry) => entry.id !== id),
    }));
  };

  const updateSocial = (id, field, value) => {
    setCvData((prevData) => ({
      ...prevData,
      socials: prevData.socials.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const updateHobbies = (value) => {
    setCvData((prevData) => ({
      ...prevData,
      hobbies: value,
    }));
  };

  const value = {
    cvData,
    setCvData,
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

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};