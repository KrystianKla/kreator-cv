import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { CVProvider } from './context/CVContext';
import './print.css';
import { AuthProvider } from './context/AuthContext';
import './Modal.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CVProvider>
          <App />
        </CVProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);