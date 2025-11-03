import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, orderBy, getDocs, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import CreateReplyForm from '../components/blog/CreateReplyForm';
import './BlogPage.css';

const LoadingSpinner = () => (
    <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
    </div>
);

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

    const handleLikeToggle = async () => {
        if (!currentUser) {
            alert("Musisz być zalogowany, aby polubić post.");
            return;
        }

        const postRef = doc(db, "posts", postId);
        const userId = currentUser.uid;
        const isLiked = post.likedBy?.includes(userId);

        try {
            await updateDoc(postRef, {
                likeCount: increment(isLiked ? -1 : 1),
                likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
            });

            setPost(prevPost => {
                const currentLikedBy = prevPost.likedBy || [];

                return {
                    ...prevPost,
                    likedBy: isLiked
                        ? currentLikedBy.filter(uid => uid !== userId)
                        : [...currentLikedBy, userId],
                    likeCount: isLiked ? prevPost.likeCount - 1 : (prevPost.likeCount || 0) + 1
                };
            });

        } catch (err) {
            console.error("Błąd podczas przełączania polubienia:", err);
        }
    };

    if (loadingPost) {
        return <div className="blog-container"><LoadingSpinner /></div>;
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
                <button
                    type="button"
                    className={`like-button ${post.likedBy?.includes(currentUser?.uid) ? 'liked' : ''}`}
                    onClick={handleLikeToggle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-2.582 1.9 20.753 20.753 0 01-1.162.682l-.019.01-.005.003h0z" />
                    </svg>
                    {post.likeCount || 0}
                </button>
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
                        <LoadingSpinner />
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