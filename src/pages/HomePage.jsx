import React from 'react';
import Hero from '../components/home/Hero';
import TemplateSelector from '../components/home/TemplateSelector';

// PL: Komponent strony głównej aplikacji (landing page).
// Zawiera sekcję powitalną (Hero) i selektor szablonów (TemplateSelector).
// EN: Homepage component of the application (landing page).
// Contains the welcome section (Hero) and the template selector (TemplateSelector).

const HomePage = () => {
  return (
    <div>
      <Hero />
      <TemplateSelector />
    </div>
  );
};

export default HomePage;