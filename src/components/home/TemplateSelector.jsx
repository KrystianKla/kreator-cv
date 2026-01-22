import { Link } from 'react-router-dom';

const TemplateSelector = () => {
  return (
    <section className="template-selector">
      <h2>Wybierz swój szablon</h2>
      <div className="template-grid">
        <Link to="/edytor" className="template-card">
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