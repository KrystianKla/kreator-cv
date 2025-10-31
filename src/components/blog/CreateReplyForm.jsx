import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import '../cv-form/FormStyles.css';

const CreateReplyForm = ({ postId, onReplyAdded }) => {
    const { currentUser } = useAuth();
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        setError("");

        if (!currentUser) {
            setError("Musisz być zalogowany, aby dodać odpowiedź.");
            return;
        }
        if (!content.trim()) {
            setError("Treść odpowiedzi nie może być pusta.");
            return;
        }

        setLoading(true);

        try {
            const repliesCollectionRef = collection(db, "posts", postId, "replies");

            await addDoc(repliesCollectionRef, {
                content: content,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || currentUser.email,
                createdAt: serverTimestamp()
            });

            setContent("");
            onReplyAdded();
        } catch (err) {
            console.error("Błąd dodawania odpowiedzi:", err);
            setError("Nie udało się dodać odpowiedzi. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitReply} className="form-section reply-form" style={{ padding: '1.5rem', marginTop: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <legend style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Dodaj odpowiedź</legend>

            {error && <p className="login-error">{error}</p>}

            <div className="form-group">
                <label htmlFor="reply-content" style={{ display: 'none' }}>Twoja odpowiedź</label>
                <textarea
                    id="reply-content"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Napisz swoją odpowiedź..."
                />
            </div>

            <button type="submit" className="login-button btn-login-email" disabled={loading}>
                {loading ? 'Publikowanie...' : 'Opublikuj odpowiedź'}
            </button>
        </form>
    );
};

export default CreateReplyForm;