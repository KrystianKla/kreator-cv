import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section">
      <h1>Stwórz profesjonalne CV w kilka minut</h1>
      <p>Wybierz szablon, wypełnij dane i pobierz gotowy dokument.</p>
      <Link to="/edytor" className="btn btn-cta">
        Rozpocznij teraz
      </Link>
    </section>
  );
};

export default Hero;