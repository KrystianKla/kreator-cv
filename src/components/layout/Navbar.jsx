import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// PL: Komponent paska nawigacyjnego (Navbar) aplikacji.
// Wyświetla linki oraz stan logowania użytkownika.
// EN: Application Navigation Bar (Navbar) component.
// Displays links and user authentication status.

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // PL: Przekieruj na stronę główną po pomyślnym wylogowaniu
      // EN: Redirect to the homepage after successful logout
      navigate('/');
      console.log('User logged out successfully.');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        KreatorCV
      </Link>

      <div className="navbar-links">
        <NavLink to="/szablony">Szablony CV</NavLink>
        <NavLink to="/przyklady">Przykłady CV</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </div>

      <div className="navbar-actions">
        {currentUser ? (
          <>
            <span style={{ marginRight: '1rem', fontWeight: '500' }}>
              Witaj, {currentUser.displayName || currentUser.email}!
            </span>
            <button onClick={handleLogout} className="btn btn-login">
              Wyloguj
            </button>
          </>
        ) : (
          // PL: Jeśli użytkownik NIE jest zalogowany
          // EN: If user is NOT logged in
          <Link to="/login" className="btn btn-login">
            Zaloguj się
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;