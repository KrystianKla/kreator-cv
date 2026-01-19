import React from 'react';
import { useCV } from '../../context/CVContext';
import FormSection from '../ui/FormSection';
import FormField from '../ui/FormField';
import './FormStyles.css';

const drivingLicenseCategories = ['A', 'A1', 'A2', 'AM', 'B', 'B1', 'C', 'C1', 'D', 'D1', 'BE', 'CE', 'DE', 'T'];

const PersonalDetailsForm = () => {
  const { cvData, updatePersonal } = useCV();
  const { personal } = cvData;

  const capitalize = (str) => str.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-');

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

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    updatePersonal('phone', val);
  };

  const handlePostalCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    updatePersonal('postalCode', val);
  };

  const formatPhone = (p) => p ? p.match(/.{1,3}/g).join('-') : '';
  const formatPostal = (c) => c && c.length > 2 ? `${c.slice(0, 2)}-${c.slice(2, 5)}` : c;

  return (
    <FormSection title="Dane Osobowe">
      <div className="form-group">
        <label htmlFor="photo">Zdjęcie profilowe</label>
        <input
          type="file"
          id="photo"
          accept="image/png, image/jpeg"
          onChange={handlePhotoChange}
          className="file-input"
        />
      </div>

      <div className="form-group-row">
        <FormField
          label="Imię"
          id="firstName"
          value={personal.firstName}
          onChange={(e) => updatePersonal('firstName', capitalize(e.target.value))}
          placeholder="Jan"
          maxLength={30}
        />
        <FormField
          label="Nazwisko"
          id="lastName"
          value={personal.lastName}
          onChange={(e) => updatePersonal('lastName', capitalize(e.target.value))}
          placeholder="Kowalski"
          maxLength={30}
        />
      </div>

      <FormField
        label="Stanowisko"
        id="position"
        value={personal.position}
        onChange={(e) => updatePersonal('position', capitalize(e.target.value))}
        placeholder="np. Senior Frontend Developer"
        maxLength={50}
      />

      <div className="form-group-row">
        <FormField
          label="Email"
          id="email"
          type="email"
          value={personal.email}
          onChange={(e) => updatePersonal('email', e.target.value)}
          placeholder="jan@mail.com"
        />
        <div className="form-group">
          <label>Telefon</label>
          <div className="phone-input-container">
            <select
              value={personal.countryCode || '+48'}
              onChange={(e) => updatePersonal('countryCode', e.target.value)}
              className="country-code-select"
            >
              <option value="+48">+48</option>
              <option value="+49">+49</option>
              <option value="+44">+44</option>
              <option value="+1">+1</option>
            </select>
            <input
              type="tel"
              value={formatPhone(personal.phone)}
              onChange={handlePhoneChange}
              placeholder="123-456-789"
            />
          </div>
        </div>
      </div>

      <FormField
        label="Adres"
        id="address"
        value={personal.address}
        onChange={(e) => updatePersonal('address', e.target.value)}
        placeholder="ul. Wesoła 10/5"
      />

      <div className="form-group-row">
        <FormField
          label="Kod pocztowy"
          id="postalCode"
          value={formatPostal(personal.postalCode)}
          onChange={handlePostalCodeChange}
          placeholder="00-001"
        />
        <FormField
          label="Miasto"
          id="city"
          value={personal.city}
          onChange={(e) => updatePersonal('city', capitalize(e.target.value))}
          placeholder="Warszawa"
        />
      </div>

      <div className="form-group">
        <label>Prawo jazdy</label>
        <div className="checkbox-group">
          {drivingLicenseCategories.map(cat => (
            <label key={cat} className="checkbox-label">
              <input
                type="checkbox"
                checked={personal.drivingLicense?.includes(cat)}
                onChange={(e) => {
                  const current = [...(personal.drivingLicense || [])];
                  const next = e.target.checked ? [...current, cat] : current.filter(c => c !== cat);
                  updatePersonal('drivingLicense', next);
                }}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>
    </FormSection>
  );
};

export default PersonalDetailsForm;