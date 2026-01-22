import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import CVExamplesPage from './pages/CVExamplesPage';
import BlogListPage from './pages/BlogListPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PostDetailPage from './pages/PostDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="edytor" element={<EditorPage />} />
        <Route path="szablony" element={<TemplatesPage />} />
        <Route path="przyklady" element={<CVExamplesPage />} />
        <Route path="blog" element={<BlogListPage />} />
        <Route path="blog/:postId" element={<PostDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="profil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />

      </Route>
    </Routes>
  );
}

export default App;