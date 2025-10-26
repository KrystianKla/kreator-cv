import { Link } from 'react-router-dom';

// PL: Komponent wyświetlający siatkę dostępnych szablonów CV na stronie głównej.
// EN: Component displaying a grid of available CV templates on the homepage.

const TemplateSelector = () => {
  return (
    <section className="template-selector">
      <h2>Wybierz swój szablon</h2>
      <div className="template-grid">
        {/* PL: Aktywna karta szablonu, linkująca do edytora */}
        {/* EN: Active template card linking to the editor */}
        <Link to="/edytor" className="template-card">
          {/* PL: Placeholder wizualny imitujący strukturę CV */}
          {/* EN: Visual placeholder imitating CV structure */}
          <div className="template-card-placeholder">
            <div className="placeholder-header"></div>
            <div className="placeholder-line"></div>
            <div className="placeholder-line-short"></div>
            <div className="placeholder-line"></div>
            <div style={{ height: '20px' }}></div>
            <div className="placeholder-line"></div>
            <div className="placeholder-line-short"></div>
          </div>
          <div className="template-card-info">
            Szablon "Nowoczesny"
          </div>
        </Link>

        {/* PL: Karta dla przyszłego, nieaktywnego szablonu */}
        {/* EN: Card for a future, inactive template */}
        <div className="template-card" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
          <div className="template-card-placeholder">
            <div className="placeholder-header"></div>
            <div className="placeholder-line"></div>
            <div className="placeholder-line-short"></div>
          </div>
          <div className="template-card-info">
            Szablon "Kreatywny" (Wkrótce)
          </div>
        </div>

      </div>
    </section>
  );
};

export default TemplateSelector;