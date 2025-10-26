import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

// PL: Lista dostępnych kategorii prawa jazdy
// EN: List of available driving license categories
const drivingLicenseCategories = ['A', 'A1', 'A2', 'AM', 'B', 'B1', 'C', 'C1', 'D', 'D1', 'BE', 'CE', 'DE', 'T'];

// PL: Komponent formularza dla sekcji "Dane Osobowe".
// EN: Form component for the "Personal Details" section.

const PersonalDetailsForm = () => {
  // PL: Pobranie stanu i funkcji aktualizującej z kontekstu CV
  // EN: Get state and update function from the CV context
  const { cvData, updatePersonal } = useCV();
  const { personal } = cvData;

  // PL: Ogólny handler dla zmian w polach tekstowych, select i dacie.
  // EN: General handler for changes in text, select, and date fields.

  const handleChange = (e) => {
    updatePersonal(e.target.name, e.target.value);
  };

  // PL: Handler do obsługi przesłania i konwersji zdjęcia profilowego na Data URL.
  // EN: Handler to manage profile photo upload and conversion to Data URL.

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updatePersonal('photo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // PL: Handler do zarządzania wyborem kategorii prawa jazdy (checkboxy).
  // EN: Handler to manage driving license category selection (checkboxes).

  const handleDrivingLicenseChange = (e) => {
    const { value, checked } = e.target;
    const currentLicenses = [...personal.drivingLicense];

    if (checked) {
      currentLicenses.push(value);
    } else {
      const index = currentLicenses.indexOf(value);
      if (index > -1) {
        currentLicenses.splice(index, 1);
      }
    }
    updatePersonal('drivingLicense', currentLicenses);
  };

  return (
    <fieldset className="form-section">
      <legend>Dane Osobowe</legend>

      <div className="form-group">
        <label htmlFor="photo">Zdjęcie (opcjonalnie)</label>
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handlePhotoChange}
          accept="image/png, image/jpeg"
        />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="firstName">Imię</label>
          <input type="text" id="firstName" name="firstName" value={personal.firstName} onChange={handleChange} placeholder="Jan" />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nazwisko</label>
          <input type="text" id="lastName" name="lastName" value={personal.lastName} onChange={handleChange} placeholder="Kowalski" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="position">Stanowisko (np. Frontend Developer)</label>
        <input type="text" id="position" name="position" value={personal.position} onChange={handleChange} placeholder="Frontend Developer" />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="email">Adres e-mail</label>
          <input type="email" id="email" name="email" value={personal.email} onChange={handleChange} placeholder="jan@mail.com" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Numer telefonu</label>
          <input type="tel" id="phone" name="phone" value={personal.phone} onChange={handleChange} placeholder="+48 123 456 789" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Adres (ulica i numer)</label>
        <input type="text" id="address" name="address" value={personal.address} onChange={handleChange} placeholder="ul. Wesoła 10/5" />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="postalCode">Kod pocztowy</label>
          <input type="text" id="postalCode" name="postalCode" value={personal.postalCode} onChange={handleChange} placeholder="00-001" />
        </div>
        <div className="form-group">
          <label htmlFor="city">Miasto</label>
          <input type="text" id="city" name="city" value={personal.city} onChange={handleChange} placeholder="Warszawa" />
        </div>
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="dob">Data urodzenia</label>
          <input type="date" id="dob" name="dob" value={personal.dob} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="pob">Miejsce urodzenia</label>
          <input type="text" id="pob" name="pob" value={personal.pob} onChange={handleChange} placeholder="Gdańsk" />
        </div>
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="sex">Płeć</label>
          <select id="sex" name="sex" value={personal.sex} onChange={handleChange}>
            <option value="">Wybierz...</option>
            <option value="Kobieta">Kobieta</option>
            <option value="Mężczyzna">Mężczyzna</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="maritalStatus">Stan cywilny</label>
          <select id="maritalStatus" name="maritalStatus" value={personal.maritalStatus} onChange={handleChange}>
            <option value="">Wybierz...</option>
            <option value="Kawaler/Panna">Kawaler/Panna</option>
            <option value="Żonaty/Mężatka">Żonaty/Mężatka</option>
            <option value="W separacji">W separacji</option>
            <option value="Rozwiedziony/Rozwiedziona">Rozwiedziony/Rozwiedziona</option>
            <option value="Wdowiec/Wdowa">Wdowiec/Wdowa</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nationality">Narodowość</label>
        <input type="text" id="nationality" name="nationality" value={personal.nationality} onChange={handleChange} placeholder="Polska" />
      </div>

      <div className="form-group">
        <label>Prawo jazdy (zaznacz posiadane kategorie)</label>
        <div className="checkbox-group">
          {drivingLicenseCategories.map(cat => (
            <label key={cat} className="checkbox-label">
              <input
                type="checkbox"
                value={cat}
                checked={personal.drivingLicense.includes(cat)}
                onChange={handleDrivingLicenseChange}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

    </fieldset>
  );
};

export default PersonalDetailsForm;