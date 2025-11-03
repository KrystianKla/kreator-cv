import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, where, doc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/blog/CreatePostForm';
import './BlogPage.css';

const LoadingSpinner = () => (
    <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
    </div>
);

const filterCategories = ["Wszystkie", "Pytanie", "Oferta Pracy", "Dyskusja"];

const getCategoryClass = (category) => {
    if (!category) return 'badge-default';
    return `badge-${category.toLowerCase().replace(/ /g, '-')}`;
};

const BlogListPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState("Wszystkie");

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const postsCollectionRef = collection(db, "posts");
            let q;

            if (filterCategory === "Wszystkie") {
                q = query(postsCollectionRef, orderBy("createdAt", "desc"));
            } else {
                q = query(
                    postsCollectionRef,
                    where("category", "==", filterCategory),
                    orderBy("createdAt", "desc")
                );
            }

            const querySnapshot = await getDocs(q);
            const postsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsList);

        } catch (error) {
            console.error("Błąd podczas pobierania postów:", error);
        }
        setLoading(false);
    }, [filterCategory]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePostCreated = () => {
        setShowForm(false);
        fetchPosts();
    };

    const handleLikeToggle = async (postId, likedByParam) => {
        if (!currentUser) {
            alert("Musisz być zalogowany, aby polubić post.");
            return;
        }

        const postRef = doc(db, "posts", postId);
        const userId = currentUser.uid;
        const likedBy = likedByParam || [];
        const isLiked = likedBy.includes(userId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likeCount: increment(-1),
                    likedBy: arrayRemove(userId)
                });
            } else {
                await updateDoc(postRef, {
                    likeCount: increment(1),
                    likedBy: arrayUnion(userId)
                });
            }

            setPosts(prevPosts =>
                prevPosts.map(p => {
                    if (p.id === postId) {
                        const currentLikedBy = p.likedBy || [];

                        const newLikedBy = isLiked
                            ? currentLikedBy.filter(uid => uid !== userId)
                            : [...currentLikedBy, userId];
                        const newLikeCount = isLiked ? p.likeCount - 1 : (p.likeCount || 0) + 1;

                        return { ...p, likedBy: newLikedBy, likeCount: newLikeCount };
                    }
                    return p;
                })
            );

        } catch (err) {
            console.error("Błąd podczas przełączania polubienia:", err);
        }
    };

    return (
        <div className="blog-container">
            <h1>Forum / Blog</h1>
            <p>Masz pytanie odnośnie CV? A może szukasz pracy? Napisz posta!</p>
            <div className="blog-controls">
                <div className="blog-filter-container">
                    <span className="filter-label">Filtruj:</span>
                    <div className="filter-buttons">
                        {filterCategories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {currentUser && (
                    <div className="create-post-placeholder">
                        <button
                            className={`btn-add-section ${showForm ? 'active' : ''}`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Anuluj' : '+ Utwórz nowy post'}
                        </button>
                    </div>
                )}
            </div>

            {showForm && <CreatePostForm onPostCreated={handlePostCreated} />}

            <div className="post-list">
                {loading ? (
                    <LoadingSpinner />
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="post-summary-card">
                            <div className="post-card-header">
                                <span className={`post-category-badge ${getCategoryClass(post.category)}`}>
                                    {post.category}
                                </span>
                                <h3>{post.title}</h3>
                            </div>
                            <p>
                                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
                            </p>
                            <div className="post-footer">
                                <span className="post-author">Autor: {post.authorName || 'Anonim'}</span>
                                <div className='post-actions'>
                                    <span className="post-reply-count">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17.607 2.344 14C1.258 12.793 1 11.432 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                                        </svg>
                                        {post.replyCount || 0}
                                    </span>
                                    <button
                                        type="button"
                                        className={`like-button ${post.likedBy?.includes(currentUser?.uid) ? 'liked' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleLikeToggle(post.id, post.likedBy);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                            <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-2.582 1.9 20.753 20.753 0 01-1.162.682l-.019.01-.005.003h0z" />
                                        </svg>
                                        {post.likeCount || 0}
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Nie ma jeszcze żadnych postów. Bądź pierwszy!</p>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;