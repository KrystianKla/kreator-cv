import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import CVExamplesPage from './pages/CVExamplesPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

// PL: Główny komponent aplikacji, odpowiedzialny za konfigurację routingu.
// Używa `react-router-dom` do definiowania tras i renderowania odpowiednich komponentów stron.
// EN: The main application component, responsible for configuring routing.
// Uses `react-router-dom` to define routes and render the corresponding page components.

function App() {
  return (
    // PL: Kontener definiujący wszystkie możliwe trasy w aplikacji.
    // EN: Container defining all possible routes in the application.
    <Routes>
      {/*
        PL: Główna trasa nadrzędna używająca MainLayout. Wszystkie trasy zagnieżdżone
            wewnątrz będą renderowane wewnątrz komponentu MainLayout (w miejscu <Outlet />).
        EN: Main parent route using MainLayout. All nested routes within
            will be rendered inside the MainLayout component (in the <Outlet /> position).
      */}
      <Route path="/" element={<MainLayout />}>
        {/* PL: Trasa indeksowa (główna strona aplikacji) renderowana pod adresem "/". */}
        {/* EN: Index route (main application page) rendered at the "/" path. */}
        <Route index element={<HomePage />} />

        {/* PL: Trasy do poszczególnych podstron aplikacji. */}
        {/* EN: Routes to individual subpages of the application. */}
        <Route path="edytor" element={<EditorPage />} />
        <Route path="szablony" element={<TemplatesPage />} />
        <Route path="przyklady" element={<CVExamplesPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* PL: Trasa "catch-all" (*) - renderuje NotFoundPage, jeśli żadna inna trasa nie pasuje. */}
        {/* EN: Catch-all route (*) - renders NotFoundPage if no other route matches. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;