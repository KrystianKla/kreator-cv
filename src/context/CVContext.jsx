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
  documents: [],
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

  const docsFromMain = baseProfile.documents || [];
  const docsFromPersonal = personalData.documents || [];
  const allDocs = [...docsFromMain, ...docsFromPersonal];
  const uniqueDocs = Array.from(new Map(allDocs.map(item => [item.id, item])).values());

  return {
    ...defaultCVData,
    summary: baseProfile.summary || "",
    hobbies: baseProfile.hobbies || "",
    experience: Array.isArray(baseProfile.experience) ? baseProfile.experience : [],
    education: Array.isArray(baseProfile.education) ? baseProfile.education : [],
    skills: Array.isArray(baseProfile.skills) ? baseProfile.skills : [],
    courses: Array.isArray(baseProfile.courses) ? baseProfile.courses : [],
    certificates: Array.isArray(baseProfile.certificates) ? baseProfile.certificates : [],
    internships: Array.isArray(baseProfile.internships) ? baseProfile.internships : [],
    languages: Array.isArray(baseProfile.languages) ? baseProfile.languages : [],
    socials: Array.isArray(baseProfile.socials) ? baseProfile.socials : [],
    documents: uniqueDocs,
    personal: {
      ...defaultCVData.personal,
      ...personalData,
      email: authUser?.email || "",
      photo: baseProfile.photo || authUser?.photoURL || "",
      firstName: personalData.firstName || authUser?.displayName || '',
      lastName: personalData.lastName || '',
    },
    sections: {
      ...defaultCVData.sections,
      ...(baseProfile.sections || {})
    }
  };
};

export const CVProvider = ({ children }) => {
  const [cvData, setCvData] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        const profileData = docSnap.exists() ? docSnap.data() : null;
        const initialCV = mapProfileToCV(profileData, currentUser);
        setCvData(initialCV);
      }, (error) => {
        console.error("Błąd Firebase:", error);
        setCvData(defaultCVData);
      });

      return () => unsubscribe();
    } else {
      setCvData(defaultCVData);
    }
  }, [currentUser]);

  const updatePersonal = (field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }) : prev);
  };

  const updateSummary = (value) => {
    setCvData((prev) => prev ? ({ ...prev, summary: value }) : prev);
  };

  const addExperience = () => {
    const newId = Date.now();
    const newEntry = { id: newId, position: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, summary: "" };
    setCvData((prev) => prev ? ({ ...prev, experience: [...prev.experience, newEntry] }) : prev);
    return newId;
  };

  const removeExperience = (id) => {
    setCvData((prev) => prev ? ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }) : prev);
  };

  const updateExperience = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      experience: prev.experience.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addEducation = () => {
    const newId = Date.now();
    const newEntry = { id: newId, degree: "", school: "", city: "", startDate: "", endDate: "", currentlyStudying: false, summary: "" };
    setCvData((prev) => prev ? ({ ...prev, education: [...prev.education, newEntry] }) : prev);
    return newId;
  };

  const removeEducation = (id) => {
    setCvData((prev) => prev ? ({ ...prev, education: prev.education.filter((e) => e.id !== id) }) : prev);
  };

  const updateEducation = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      education: prev.education.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addSkill = () => {
    const newEntry = { id: Date.now(), name: "", level: 3 };
    setCvData((prev) => prev ? ({ ...prev, skills: [...prev.skills, newEntry] }) : prev);
  };

  const removeSkill = (id) => {
    setCvData((prev) => prev ? ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }) : prev);
  };

  const updateSkill = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      skills: prev.skills.map((s) => s.id === id ? { ...s, [field]: value } : s),
    }) : prev);
  };

  const addCourse = () => {
    const newId = Date.now();
    setCvData((prev) => prev ? ({ ...prev, courses: [...prev.courses, { id: newId, courseName: "", provider: "", startDate: "", endDate: "", summary: "" }] }) : prev);
  };

  const removeCourse = (id) => {
    setCvData((prev) => prev ? ({ ...prev, courses: prev.courses.filter((e) => e.id !== id) }) : prev);
  };

  const updateCourse = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      courses: prev.courses.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addCertificate = () => {
    setCvData((prev) => prev ? ({ ...prev, certificates: [...prev.certificates, { id: Date.now(), name: "", year: "", description: "" }] }) : prev);
  };

  const removeCertificate = (id) => {
    setCvData((prev) => prev ? ({ ...prev, certificates: prev.certificates.filter((e) => e.id !== id) }) : prev);
  };

  const updateCertificate = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      certificates: prev.certificates.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addLanguage = () => {
    setCvData((prev) => prev ? ({ ...prev, languages: [...prev.languages, { id: Date.now(), name: "", level: "Biegły" }] }) : prev);
  };

  const removeLanguage = (id) => {
    setCvData((prev) => prev ? ({ ...prev, languages: prev.languages.filter((e) => e.id !== id) }) : prev);
  };

  const updateLanguage = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      languages: prev.languages.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addSocial = () => {
    setCvData((prev) => prev ? ({ ...prev, socials: [...prev.socials, { id: Date.now(), label: "", url: "" }] }) : prev);
  };

  const removeSocial = (id) => {
    setCvData((prev) => prev ? ({ ...prev, socials: prev.socials.filter((e) => e.id !== id) }) : prev);
  };

  const updateSocial = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      socials: prev.socials.map((e) => e.id === id ? { ...e, [field]: value } : e),
    }) : prev);
  };

  const addDocument = (docMetadata) => {
    setCvData((prev) => prev ? ({
      ...prev,
      documents: [...(prev.documents || []), docMetadata],
    }) : prev);
  };

  const removeDocument = (id) => {
    setCvData((prev) => prev ? ({
      ...prev,
      documents: (prev.documents || []).filter((doc) => doc.id !== id),
    }) : prev);
  };

  const updateHobbies = (value) => {
    setCvData((prev) => prev ? ({ ...prev, hobbies: value }) : prev);
  };

  const toggleSection = (sectionName) => {
    setCvData((prev) => prev ? ({
      ...prev,
      sections: { ...prev.sections, [sectionName]: !prev.sections[sectionName] },
    }) : prev);
  };

  const addInternship = () => {
    const newId = Date.now();
    const newEntry = { id: newId, position: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, summary: "" };
    setCvData((prev) => prev ? ({ ...prev, internships: [...prev.internships, newEntry] }) : prev);
    return newId;
  };

  const removeInternship = (id) => {
    setCvData((prev) => prev ? ({ ...prev, internships: prev.internships.filter((e) => e.id !== id) }) : prev);
  };

  const updateInternship = (id, field, value) => {
    setCvData((prev) => prev ? ({
      ...prev,
      internships: prev.internships.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }) : prev);
  };

  const toggleInternshipCurrentlyWorking = (id) => {
    setCvData((prev) => prev ? ({
      ...prev,
      internships: prev.internships.map((e) =>
        e.id === id ? { ...e, currentlyWorking: !e.currentlyWorking, endDate: !e.currentlyWorking ? "" : e.endDate } : e
      ),
    }) : prev);
  };

  const value = {
    cvData, setCvData, updatePersonal, updateSummary, addExperience, removeExperience, updateExperience,
    addEducation, removeEducation, updateEducation, addSkill, removeSkill, updateSkill,
    addCourse, removeCourse, updateCourse, addCertificate, removeCertificate, updateCertificate,
    addLanguage, removeLanguage, updateLanguage, addSocial, removeSocial, updateSocial,
    updateHobbies, addDocument, removeDocument, toggleSection, addInternship, removeInternship,
    updateInternship, toggleInternshipCurrentlyWorking,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) throw new Error('useCV must be used within a CVProvider');
  return context;
};