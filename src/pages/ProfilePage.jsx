import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import ExperienceForm from '../components/cv-form/ExperienceForm';
import EducationForm from '../components/cv-form/EducationForm';
import SkillsForm from '../components/cv-form/SkillsForm';
import CoursesForm from '../components/cv-form/CoursesForm';
import CertificatesForm from '../components/cv-form/CertificatesForm';
import InternshipsForm from '../components/cv-form/InternshipsForm';
import LanguagesForm from '../components/cv-form/LanguagesForm';
import SocialsForm from '../components/cv-form/SocialsForm';
import HobbiesForm from '../components/cv-form/HobbiesForm';
import SectionModal from '../components/ui/SectionModal';
import '../components/cv-form/FormStyles.css';
import './ProfilePage.css';
import { useCV } from '../context/CVContext';

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCA5LjE4IDIgMTQuNTQgMiAxMGMwIDUuMjUgMy43MyAxMCA5LjI1IDEwQzE3LjA1IDIwIDIxIDE1LjcyIDIxIDEwYzAtNC41NC00LjQ4LTcuODItOS45Ny03Ljk5QTkuNDQgOS40NCAwIDAwMTIgMnpNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDR6bTAtMmMxLjEgMCAyIC45IDIgMnMtLjkgMi0yIDItMi0uOS0yLTIgLjktMiAyIDJ6bTAtMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHptLTZgMmMuMi0uNzEgMy4zLTEuNzUgNi0xLjc1czUuOCAxLjA0IDYgMS43NVYxOEg2di0yek0xMiA5LjVjMS4zOCAwIDIuNS0xLjEyIDIuNS0yLjVTMTMuMzggNSAxMiA1cy0yLjUgMS4xMi0yLjUgMi41IDEuMTIgMi41IDIuNSAyLjV6Ii8+PC9zdmc+';

Modal.setAppElement('#root');

const ProfilePage = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const { cvData, setCvData } = useCV();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [modals, setModals] = useState({
        summary: false, experience: false, education: false, skills: false,
        courses: false, certificates: false, internships: false,
        languages: false, socials: false, hobbies: false,
    });

    const [photoURL, setPhotoURL] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [nick, setNick] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+48');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [summary, setSummary] = useState('');
    const photoInputRef = useRef(null);


    const toggleModal = (modalName, isOpen) => {
        setModals(prev => ({ ...prev, [modalName]: isOpen }));
        if (isOpen) { setSuccessMessage(''); setErrorMessage(''); }
    };


    useEffect(() => {
        if (!currentUser) return;
        setEmail(currentUser.email);
        const userDocRef = doc(db, "users", currentUser.uid);

        const fetchUserData = async () => {
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNick(data.displayName || currentUser.displayName || '');
                    setFirstName(data.personal?.firstName || '');
                    setLastName(data.personal?.lastName || '');
                    setPhone(data.personal?.phone || '');
                    setCountryCode(data.personal?.countryCode || '+48');
                    setAddress(data.personal?.address || '');
                    setPostalCode(data.personal?.postalCode || '');
                    setCity(data.personal?.city || '');
                    setSummary(data.summary || '');
                    setPhotoURL(data.photo || currentUser.photoURL);
                } else {
                    setNick(currentUser.displayName || '');
                    setPhotoURL(currentUser.photoURL);
                }
            } catch (error) {
                console.error("Błąd wczytywania danych profilu:", error);
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoURL(URL.createObjectURL(file));
        }
    };

    const formatDisplayPhone = (phone) => {
        if (!phone) return '';
        const cleanPhone = phone.replace(/\D/g, '');
        const parts = cleanPhone.match(/.{1,3}/g);
        return parts ? parts.join('-') : cleanPhone;
    };

    const handleProfilePhoneChange = (e) => {
        const onlyNums = e.target.value.replace(/\D/g, '');
        const truncated = onlyNums.slice(0, 9);
        setPhone(truncated);
    };

    const formatDisplayPostalCode = (code) => {
        if (!code) return '';
        const clean = code.replace(/\D/g, '').slice(0, 5);
        if (clean.length > 2) {
            return `${clean.slice(0, 2)}-${clean.slice(2, 5)}`;
        }
        return clean;
    };


    const handleProfilePostalCodeChange = (e) => {
        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 5);
        setPostalCode(onlyNums);
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';

        return string
            .split('-')
            .map(part => {
                if (!part) return '';
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            })
            .join('-');
    };

    const handleSaveMainProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (!currentUser) { setErrorMessage('Musisz być zalogowany.'); setLoading(false); return; }

        try {
            let updatedPhotoURL = photoURL;

            await updateProfile(auth.currentUser, {
                displayName: nick,
                photoURL: updatedPhotoURL
            });

            const userDocRef = doc(db, "users", currentUser.uid);
            const newPersonalData = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                countryCode: countryCode,
                address: address,
                postalCode: postalCode,
                city: city,
            };

            await setDoc(userDocRef, {

                displayName: nick,
                photo: photoURL,
                summary: summary,

                personal: {
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    countryCode: countryCode,
                    address: address,
                    postalCode: postalCode,
                    city: city,
                },

                experience: cvData.experience,
                education: cvData.education,
                skills: cvData.skills,
                courses: cvData.courses,
                certificates: cvData.certificates,
                internships: cvData.internships,
                languages: cvData.languages,
                socials: cvData.socials,
                hobbies: cvData.hobbies,

            }, { merge: true });

            if (typeof setCvData === 'function') {
                setCvData(prev => ({
                    ...prev,
                    summary: summary,
                    personal: {
                        ...prev.personal,
                        ...newPersonalData
                    }
                }));
            } else {
                console.warn("setCvData nie jest dostępne w CVContext!");
            }

            setSuccessMessage('Profil został pomyślnie zaktualizowany!');
            setPhotoFile(null);

        } catch (error) {
            console.error("Błąd zapisu profilu:", error);
            setErrorMessage('Wystąpił błąd podczas zapisywania.');
        } finally {
            setLoading(false);
        }
    };

    const modalConfigs = [
        {
            id: 'summary',
            title: 'Profil Osobisty',
            isLarge: false,
            content: (
                <div className="form-group">
                    <textarea
                        className="profile-summary-textarea"
                        rows="10"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Napisz o sobie..."
                    />
                </div>
            )
        },
        { id: 'experience', title: 'Doświadczenie Zawodowe', isLarge: true, content: <ExperienceForm /> },
        { id: 'education', title: 'Edukacja', isLarge: true, content: <EducationForm /> },
        { id: 'skills', title: 'Umiejętności', isLarge: false, content: <SkillsForm /> },
        { id: 'languages', title: 'Języki', isLarge: false, content: <LanguagesForm /> },
        { id: 'courses', title: 'Kursy', isLarge: true, content: <CoursesForm /> },
        { id: 'certificates', title: 'Certyfikaty', isLarge: true, content: <CertificatesForm /> },
        { id: 'internships', title: 'Staże', isLarge: true, content: <InternshipsForm /> },
        { id: 'socials', title: 'Linki / Social Media', isLarge: false, content: <SocialsForm /> },
        { id: 'hobbies', title: 'Zainteresowania', isLarge: false, content: <HobbiesForm /> },
    ];

    const renderSectionTrigger = (title, description, modalName) => (
        <fieldset className="form-section profile-section-trigger">
            <div className="section-trigger-header">
                <legend>{title}</legend>
                <p>{description}</p>
            </div>
            <button
                type="button"
                className="btn-edit-section"
                onClick={() => toggleModal(modalName, true)}
            >
                Edytuj
            </button>
        </fieldset>
    );

    return (
        <div className="profile-container">
            <aside className="profile-sidebar">
                <div className="profile-card">
                    <label htmlFor="photo-upload-input" className="avatar-upload-trigger">
                        <img src={photoURL || defaultAvatar} alt="Awatar" className="profile-avatar" />
                        <div className="avatar-edit-overlay">Edytuj</div>
                    </label>
                    <input
                        type="file" id="photo-upload-input" accept="image/png, image/jpeg"
                        onChange={handlePhotoChange} ref={photoInputRef}
                    />
                    <h2>{nick || 'Nazwa użytkownika'}</h2>
                    <p>{email}</p>
                </div>
            </aside>

            <main className="profile-content-grid">
                <div className="main-forms">
                    <div className="info-box">
                        <span className="info-box-icon">💡</span>
                        <p>Informacje, które tu wprowadzisz, zostaną użyte w kreatorze CV.</p>
                    </div>

                    {successMessage && <p style={{ color: 'green', fontWeight: '600', marginBottom: '1rem' }}>{successMessage}</p>}
                    {errorMessage && <p className="login-error">{errorMessage}</p>}

                    <form onSubmit={handleSaveMainProfile}>
                        <fieldset className="form-section">
                            <legend>Dane Główne</legend>
                            <div className="login-form-group">
                                <label htmlFor="nick">Nick</label>
                                <input type="text" id="nick" value={nick} onChange={(e) => setNick(e.target.value)} />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Imię</label>
                                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(capitalizeFirstLetter(e.target.value))} maxLength={30} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Nazwisko</label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(capitalizeFirstLetter(e.target.value))} maxLength={30} />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="form-section">
                            <legend>Dane Kontaktowe</legend>
                            <div className="login-form-group">
                                <label htmlFor="email">Adres e-mail</label>
                                <input type="email" id="email" value={email} disabled readOnly />
                            </div>
                            <div className="login-form-group">
                                <label htmlFor="phone">Numer telefonu</label>
                                <div className="phone-input-container">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="country-code-select"
                                    >
                                        <option value="+48">+48</option>
                                        <option value="+49">+49</option>
                                        <option value="+44">+44</option>
                                        <option value="+1">+1</option>
                                        <option value="+420">+420</option>
                                    </select>
                                    <input type="tel" id="phone" value={formatDisplayPhone(phone)} onChange={handleProfilePhoneChange} placeholder="123-456-789" />
                                </div>
                            </div>
                            <div className="login-form-group">
                                <label htmlFor="address">Adres</label>
                                <input type="text" id="address" value={address} onChange={(e) => {
                                    const formatted = capitalizeFirstLetter(e.target.value);
                                    setAddress(formatted);
                                }} />
                            </div>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label htmlFor="postalCode">Kod pocztowy</label>
                                    <input type="text" id="postalCode" value={formatDisplayPostalCode(postalCode)} onChange={handleProfilePostalCodeChange} placeholder="00-001" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="city">Miasto</label>
                                    <input type="text" id="city" value={city} onChange={(e) => {
                                        const formatted = capitalizeFirstLetter(e.target.value);
                                        setCity(formatted);
                                    }} />
                                </div>
                            </div>
                        </fieldset>

                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn-save-profile" disabled={loading}>
                                {loading ? 'Zapisywanie...' : 'Zapisz dane podstawowe'}
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="secondary-triggers">
                    {renderSectionTrigger("Profil Osobisty", "Podsumowanie zawodowe.", "summary")}
                    {renderSectionTrigger("Doświadczenie", "Historia zatrudnienia.", "experience")}
                    {renderSectionTrigger("Edukacja", "Szkoły i uczelnie.", "education")}
                    {renderSectionTrigger("Umiejętności", "Twoje kompetencje.", "skills")}
                    {renderSectionTrigger("Języki", "Znajomość języków obcych.", "languages")}
                    {renderSectionTrigger("Kursy", "Szkolenia i certyfikaty.", "courses")}
                    {renderSectionTrigger("Certyfikaty", "Dodatkowe uprawnienia.", "certificates")}
                    {renderSectionTrigger("Staże", "Praktyki zawodowe.", "internships")}
                    {renderSectionTrigger("Linki", "Social media i portfolio.", "socials")}
                    {renderSectionTrigger("Zainteresowania", "Hobby i pasje.", "hobbies")}
                </aside>
            </main>

            {modalConfigs.map((config) => (
                <SectionModal
                    key={config.id}
                    isOpen={modals[config.id]}
                    onClose={() => toggleModal(config.id, false)}
                    title={config.title}
                    isLarge={config.isLarge}
                >
                    {config.content}
                </SectionModal>
            ))}

        </div>
    );
};

export default ProfilePage;