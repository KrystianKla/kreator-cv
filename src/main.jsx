import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { CVProvider } from './context/CVContext';
import './print.css';

// PL: Renderowanie głównego komponentu aplikacji w DOM
// EN: Rendering the main application component into the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* PL: BrowserRouter umożliwia routing po stronie klienta */}
    {/* EN: BrowserRouter enables client-side routing */}
    <BrowserRouter>
      {/* PL: CVProvider udostępnia stan danych CV całej aplikacji */}
      {/* EN: CVProvider makes the CV data state available to the entire application */}
      <CVProvider>
        <App />
      </CVProvider>
    </BrowserRouter>
  </React.StrictMode>,
);