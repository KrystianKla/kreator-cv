import { Link } from 'react-router-dom';

// PL: Komponent "Hero" - główna sekcja powitalna na stronie głównej.
// EN: "Hero" component - the main welcome section on the homepage.

const Hero = () => {
  return (
    <section className="hero-section">
      <h1>Stwórz profesjonalne CV w kilka minut</h1>
      <p>Wybierz szablon, wypełnij dane i pobierz gotowy dokument.</p>
      {/* PL: Przycisk wzywający do akcji, linkujący do edytora CV */}
      {/* EN: Call-to-action button linking to the CV editor */}
      <Link to="/edytor" className="btn btn-cta">
        Rozpocznij teraz
      </Link>
    </section>
  );
};

export default Hero;