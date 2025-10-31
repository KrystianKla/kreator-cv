import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import CreateReplyForm from '../components/blog/CreateReplyForm';
import './BlogPage.css';

const PostDetailPage = () => {
    const { postId } = useParams();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loadingPost, setLoadingPost] = useState(true);
    const [loadingReplies, setLoadingReplies] = useState(true);
    const [error, setError] = useState(null);

    const fetchPost = useCallback(async () => {
        setLoadingPost(true);
        setError(null);
        try {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                setPost(postSnap.data());
            } else {
                setError("Nie znaleziono posta.");
            }
        } catch (err) {
            console.error("Błąd pobierania posta:", err);
            setError("Wystąpił błąd podczas ładowania posta.");
        }
        setLoadingPost(false);
    }, [postId]);

    const fetchReplies = useCallback(async () => {
        setLoadingReplies(true);
        try {
            const repliesRef = collection(db, "posts", postId, "replies");
            const q = query(repliesRef, orderBy("createdAt", "asc"));

            const querySnapshot = await getDocs(q);
            const repliesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReplies(repliesList);
        } catch (err) {
            console.error("Błąd pobierania odpowiedzi:", err);
        }
        setLoadingReplies(false);
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchPost();
            fetchReplies();
        }
    }, [postId, fetchPost, fetchReplies]);

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        return new Date(timestamp.seconds * 1000).toLocaleString('pl-PL', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loadingPost) {
        return <div className="blog-container"><p>Ładowanie posta...</p></div>;
    }
    if (error) {
        return <div className="blog-container"><p style={{ color: 'red' }}>{error}</p></div>;
    }
    if (!post) {
        return <div className="blog-container"><p>Nie znaleziono posta.</p></div>;
    }

    return (
        <div className="blog-container">
            <Link to="/blog" className="btn-back-to-blog">← Wróć do listy</Link>

            <div className="post-detail-card">
                <h1>{post.title}</h1>
                <span className="post-author">
                    Autor: {post.authorName || 'Anonim'} | Utworzono: {formatDate(post.createdAt)}
                </span>
                <hr />
                <p className="post-content">{post.content}</p>
            </div>

            <div className="replies-section">
                <h2>Odpowiedzi ({replies.length})</h2>

                {currentUser ? (
                    <CreateReplyForm postId={postId} onReplyAdded={fetchReplies} />
                ) : (
                    <p style={{ fontWeight: '600', textAlign: 'center' }}>
                        <Link to="/login">Zaloguj się</Link>, aby dodać odpowiedź.
                    </p>
                )}

                <div className="replies-list">
                    {loadingReplies ? (
                        <p>Ładowanie odpowiedzi...</p>
                    ) : replies.length > 0 ? (
                        replies.map(reply => (
                            <div key={reply.id} className="reply-card">
                                <p className="reply-author">
                                    <strong>{reply.authorName || 'Anonim'}</strong>
                                    <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                </p>
                                <p className="reply-content">{reply.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nie ma jeszcze żadnych odpowiedzi. Bądź pierwszy!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;