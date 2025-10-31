import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import '../cv-form/FormStyles.css';

const CreatePostForm = ({ onPostCreated }) => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Pytanie");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setError("");

        if (!currentUser) {
            setError("Musisz być zalogowany, aby dodać post.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            setError("Tytuł i treść posta nie mogą być puste.");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "posts"), {
                title: title,
                content: content,
                category: category,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || currentUser.email,
                createdAt: serverTimestamp()
            });

            setTitle("");
            setContent("");
            setCategory("Pytanie");
            onPostCreated();
        } catch (err) {
            console.error("Błąd dodawania posta:", err);
            setError("Nie udało się dodać posta. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreatePost} className="form-section" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <legend style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Stwórz nowy wpis</legend>

            {error && <p className="login-error">{error}</p>}

            <div className="form-group">
                <label htmlFor="post-title">Tytuł</label>
                <input
                    type="text"
                    id="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Chwytliwy tytuł lub pytanie..."
                />
            </div>

            <div className="form-group">
                <label htmlFor="post-category">Kategoria</label>
                <div className="form-group">
                    <label htmlFor="post-category">Kategoria</label>
                    <select
                        id="post-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select"
                    >
                        <option value="Pytanie">Pytanie</option>
                        <option value="Oferta Pracy">Oferta Pracy</option>
                        <option value="Dyskusja">Dyskusja</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="post-content">Treść</label>
                <textarea
                    id="post-content"
                    rows="6"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Jak wypełnić sekcję 'Umiejętności'?..."
                />
            </div>

            <button type="submit" className="login-button btn-login-email" disabled={loading}>
                {loading ? 'Publikowanie...' : 'Opublikuj post'}
            </button>
        </form>
    );
};

export default CreatePostForm;