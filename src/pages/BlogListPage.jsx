import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/blog/CreatePostForm';
import './BlogPage.css';

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
                    <p>Ładowanie postów...</p>
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