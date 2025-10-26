import { NavLink, Link } from 'react-router-dom';

// PL: Komponent paska nawigacyjnego (Navbar) aplikacji.
// EN: Application Navigation Bar (Navbar) component.

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* PL: Link do strony głównej z logiem/nazwą aplikacji */}
      {/* EN: Link to the homepage with the app logo/name */}
      <Link to="/" className="navbar-brand">
        KreatorCV
      </Link>

      {/* PL: Główne linki nawigacyjne */}
      {/* EN: Main navigation links */}
      <div className="navbar-links">
        <NavLink to="/szablony">Szablony CV</NavLink>
        <NavLink to="/przyklady">Przykłady CV</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </div>

      {/* PL: Sekcja z przyciskami akcji (np. logowanie) */}
      {/* EN: Section with action buttons (e.g., login) */}
      <div className="navbar-actions">
        <Link to="/login" className="btn btn-login">
          Zaloguj się
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;