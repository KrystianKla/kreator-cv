import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

// PL: Główny komponent layoutu aplikacji. Zawiera Navbar i dynamicznie renderuje treść strony (<Outlet />).
// Dostosowuje kontener treści w zależności od tego, czy użytkownik jest na stronie edytora.
// EN: Main application layout component. Includes the Navbar and dynamically renders page content (<Outlet />).
// Adjusts the content container based on whether the user is on the editor page.

const MainLayout = () => {
  const location = useLocation();
  const isEditorPage = location.pathname.startsWith('/edytor');

  return (
    <div>
      <Navbar />
      
      {isEditorPage ? (
        <Outlet />
      ) : (
        <main className="main-content">
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default MainLayout;