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
  documents: [], // Dokumenty na głównym poziomie
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

// FUNKCJA MAPUJĄCA - Poprawiona, by pobierać wszystkie sekcje
const mapProfileToCV = (profileData, authUser) => {
  const baseProfile = profileData || {};
  const personalData = baseProfile.personal || {};

  // Logika szukania dokumentów w różnych miejscach (starych i nowych)
  const docsFromMain = baseProfile.documents || [];
  const docsFromPersonal = personalData.documents || [];

  // Łączymy listy i usuwamy duplikaty po ID (na wypadek gdyby były w obu miejscach)
  const allDocs = [...docsFromMain, ...docsFromPersonal];
  const uniqueDocs = Array.from(new Map(allDocs.map(item => [item.id, item])).values());

  return {
    ...defaultCVData,
    summary: baseProfile.summary || defaultCVData.summary,
    hobbies: baseProfile.hobbies || defaultCVData.hobbies,
    experience: baseProfile.experience || [],
    education: baseProfile.education || [],
    skills: baseProfile.skills || [],
    courses: baseProfile.courses || [],
    certificates: baseProfile.certificates || [],
    internships: baseProfile.internships || [],
    languages: baseProfile.languages || [],
    socials: baseProfile.socials || [],

    // ZMIANA: Używamy połączonej listy dokumentów
    documents: uniqueDocs,

    personal: {
      ...defaultCVData.personal,
      ...personalData,
      email: authUser?.email || "",
      photo: baseProfile.photo || authUser?.photoURL || "",
      firstName: personalData.firstName || authUser?.displayName || '',
      lastName: personalData.lastName || '',
    },
    sections: baseProfile.sections || defaultCVData.sections
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
        console.error("Błąd wczytywania danych profilu:", error);
      });

      return () => unsubscribe();
    } else {
      setCvData(defaultCVData);
    }
  }, [currentUser]);

  // --- FUNKCJE AKTUALIZUJĄCE ---

  const updatePersonal = (field, value) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const updateSummary = (value) => {
    setCvData((prev) => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    const newId = Date.now();
    const newEntry = { id: newId, position: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, summary: "" };
    setCvData((prev) => ({ ...prev, experience: [...prev.experience, newEntry] }));
    return newId;
  };

  const removeExperience = (id) => {
    setCvData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  };

  const updateExperience = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addEducation = () => {
    const newId = Date.now();
    const newEntry = { id: newId, degree: "", institution: "", location: "", startDate: "", endDate: "", currentlyStudying: false, summary: "" };
    setCvData((prev) => ({ ...prev, education: [...prev.education, newEntry] }));
    return newId;
  };

  const removeEducation = (id) => {
    setCvData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  const updateEducation = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addSkill = () => {
    const newEntry = { id: Date.now(), name: "", level: 3 };
    setCvData((prev) => ({ ...prev, skills: [...prev.skills, newEntry] }));
  };

  const removeSkill = (id) => {
    setCvData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  const updateSkill = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const addCourse = () => {
    const newId = Date.now();
    setCvData((prev) => ({ ...prev, courses: [...prev.courses, { id: newId, courseName: "", provider: "", startDate: "", endDate: "", summary: "" }] }));
  };

  const removeCourse = (id) => {
    setCvData((prev) => ({ ...prev, courses: prev.courses.filter((e) => e.id !== id) }));
  };

  const updateCourse = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      courses: prev.courses.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addCertificate = () => {
    setCvData((prev) => ({ ...prev, certificates: [...prev.certificates, { id: Date.now(), name: "", year: "", description: "" }] }));
  };

  const removeCertificate = (id) => {
    setCvData((prev) => ({ ...prev, certificates: prev.certificates.filter((e) => e.id !== id) }));
  };

  const updateCertificate = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addLanguage = () => {
    setCvData((prev) => ({ ...prev, languages: [...prev.languages, { id: Date.now(), name: "", level: "Biegły" }] }));
  };

  const removeLanguage = (id) => {
    setCvData((prev) => ({ ...prev, languages: prev.languages.filter((e) => e.id !== id) }));
  };

  const updateLanguage = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const addSocial = () => {
    setCvData((prev) => ({ ...prev, socials: [...prev.socials, { id: Date.now(), label: "", url: "" }] }));
  };

  const removeSocial = (id) => {
    setCvData((prev) => ({ ...prev, socials: prev.socials.filter((e) => e.id !== id) }));
  };

  const updateSocial = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      socials: prev.socials.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  // DOKUMENTY
  const addDocument = (docMetadata) => {
    setCvData((prev) => ({
      ...prev,
      documents: [...(prev.documents || []), docMetadata],
    }));
  };

  const removeDocument = (id) => {
    setCvData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((doc) => doc.id !== id),
    }));
  };

  const updateHobbies = (value) => {
    setCvData((prev) => ({ ...prev, hobbies: value }));
  };

  const toggleSection = (sectionName) => {
    setCvData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [sectionName]: !prev.sections[sectionName] },
    }));
  };

  const value = {
    cvData, setCvData, updatePersonal, updateSummary, addExperience, removeExperience, updateExperience,
    addEducation, removeEducation, updateEducation, addSkill, removeSkill, updateSkill,
    addCourse, removeCourse, updateCourse, addCertificate, removeCertificate, updateCertificate,
    addLanguage, removeLanguage, updateLanguage, addSocial, removeSocial, updateSocial,
    updateHobbies, addDocument, removeDocument, toggleSection
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) throw new Error('useCV must be used within a CVProvider');
  return context;
};