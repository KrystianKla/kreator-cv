import React from 'react';
import { useCV } from '../../context/CVContext';
import './FormStyles.css';

const drivingLicenseCategories = ['A', 'A1', 'A2', 'AM', 'B', 'B1', 'C', 'C1', 'D', 'D1', 'BE', 'CE', 'DE', 'T'];

const PersonalDetailsForm = () => {
  const { cvData, updatePersonal } = useCV();
  const { personal } = cvData;

  const handleChange = (e) => {
    updatePersonal(e.target.name, e.target.value);
  };

  const handlePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, '');
    const truncated = onlyNums.slice(0, 9);
    updatePersonal('phone', truncated);
  };

  const formatDisplayPhone = (phone) => {
    if (!phone) return '';
    const parts = phone.match(/.{1,3}/g);
    return parts ? parts.join('-') : phone;
  };

  const formatDisplayPostalCode = (code) => {
    if (!code) return '';
    const clean = code.replace(/\D/g, '');
    if (clean.length > 2) {
      return `${clean.slice(0, 2)}-${clean.slice(2, 5)}`;
    }
    return clean;
  };

  const handlePostalCodeChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, '');
    const truncated = onlyNums.slice(0, 5);
    updatePersonal('postalCode', truncated);

    handleInputChange({
      target: {
        name: 'postalCode',
        value: truncated
      }
    });
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
          <input type="text" id="firstName" name="firstName" value={personal.firstName}
            onChange={(e) => {
              const formatted = capitalizeFirstLetter(e.target.value);
              updatePersonal('firstName', formatted);
            }}
            maxLength={30} placeholder="Jan" />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nazwisko</label>
          <input type="text" id="lastName" name="lastName" value={personal.lastName}
            onChange={(e) => {
              const formatted = capitalizeFirstLetter(e.target.value);
              updatePersonal('lastName', formatted);
            }}
            maxLength={30} placeholder="Kowalski" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="position">Stanowisko (np. Frontend Developer)</label>
        <input type="text" id="position" name="position" value={personal.position}
          onChange={(e) => updatePersonal('position', capitalizeFirstLetter(e.target.value))}
          placeholder="Frontend Developer" />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="email">Adres e-mail</label>
          <input type="email" id="email" name="email" value={personal.email} onChange={handleChange} placeholder="jan@mail.com" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Numer telefonu</label>
          <div className="phone-input-container">
            <select
              name="countryCode"
              value={personal.countryCode || '+48'}
              onChange={handleChange}
              className="country-code-select"
              style={{ width: '85px' }}
            >
              <option value="+48">+48</option>
              <option value="+49">+49</option>
              <option value="+44">+44</option>
              <option value="+1">+1</option>
              <option value="+420">+420</option>
            </select>
            <input type="tel" id="phone" name="phone" value={formatDisplayPhone(personal.phone)} onChange={handlePhoneChange} placeholder="123 456 789" />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Adres (ulica i numer)</label>
        <input type="text" id="address" name="address" value={personal.address} onChange={handleChange} placeholder="ul. Wesoła 10/5" />
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="postalCode">Kod pocztowy</label>
          <input type="text" id="postalCode" name="postalCode" value={formatDisplayPostalCode(cvData.personal.postalCode)} onChange={handlePostalCodeChange} placeholder="00-001" maxLength={6} />
        </div>
        <div className="form-group">
          <label htmlFor="city">Miasto</label>
          <input type="text" id="city" name="city" value={personal.city} onChange={(e) => {
            const formatted = capitalizeFirstLetter(e.target.value);
            updatePersonal('city', formatted);
          }} placeholder="Warszawa" />
        </div>
      </div>

      <div className="form-group-row">
        <div className="form-group">
          <label htmlFor="dob">Data urodzenia</label>
          <input type="date" id="dob" name="dob" value={personal.dob} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="pob">Miejsce urodzenia</label>
          <input type="text" id="pob" name="pob" value={personal.pob} onChange={(e) => {
            const formatted = capitalizeFirstLetter(e.target.value);
            updatePersonal('pob', formatted);
          }} placeholder="Gdańsk" />
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
        <input type="text" id="nationality" name="nationality" value={personal.nationality}
          onChange={(e) => {
            const onlyLetters = e.target.value.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]/g, '');
            const formatted = capitalizeFirstLetter(onlyLetters);
            updatePersonal('nationality', formatted);
          }}
          placeholder="Polska" />
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