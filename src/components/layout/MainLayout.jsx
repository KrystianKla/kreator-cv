import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

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