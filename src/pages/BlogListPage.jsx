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

const formatPostTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
        return '...';
    }
    try {
        const date = timestamp.toDate();
        return date.toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch (error) {
        console.error("Błąd formatowania daty:", error);
        return '...';
    }
};

const BlogListPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState("Wszystkie");
    const [sortBy, setSortBy] = useState("createdAt");
    const [timeFilter, setTimeFilter] = useState("allTime");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let q = collection(db, "posts");

            if (filterCategory !== "Wszystkie") {
                q = query(q, where("category", "==", filterCategory));
            }

            let isTimeFiltered = false;
            if (timeFilter !== "allTime" && sortBy === "createdAt") {
                isTimeFiltered = true;
                let startDate;
                const now = new Date();

                if (timeFilter === "lastWeek") {
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                } else if (timeFilter === "lastMonth") {
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                }

                if (startDate) {
                    q = query(q, where("createdAt", ">=", startDate));
                }
            }

            if (sortBy === "likeCount") {
                q = query(q, orderBy("likeCount", "desc"));
            }
            else if (sortBy === "replyCount") {
                q = query(q, orderBy("replyCount", "desc"));
            }
            else {
                q = query(q, orderBy("createdAt", "desc"));
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
    }, [filterCategory, sortBy, timeFilter]);

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

    const filteredPosts = posts.filter(post => {
        const title = (post.title || '').toLowerCase();
        const search = searchTerm.toLowerCase().trim();

        if (!search) {
            return true;
        }

        const words = title.split(' ');

        return words.some(word => word.startsWith(search));
    });

    return (
        <div className="blog-container">
            <h1>Forum / Blog</h1>
            <p>Masz pytanie odnośnie CV? A może szukasz pracy? Napisz posta!</p>
            <div className="blog-controls">
                <div className="blog-search-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="text"
                        className="blog-search-input"
                        placeholder="Wyszukaj w tytułach..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="blog-action-buttons">
                    <button
                        type="button"
                        className="btn-toggle-filters"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        Filtry
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className={`filter-arrow ${showAdvancedFilters ? 'open' : ''}`}>
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {currentUser && (
                        <button
                            className="btn-add-section"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Anuluj' : '+ Utwórz post'}
                        </button>
                    )}
                </div>
            </div>

            {showAdvancedFilters && (
                <div className="advanced-filters-panel">
                    <div className="blog-filter-container">
                        <span className="filter-label">Kategoria:</span>
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

                    <div className="blog-filter-container">
                        <label htmlFor="sort-by-filter" className="filter-label">Sortuj wg:</label>
                        <select
                            id="sort-by-filter"
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="createdAt">Najnowsze</option>
                            <option value="likeCount">Najwięcej polubień</option>
                            <option value="replyCount">Najwięcej odpowiedzi</option>
                        </select>
                    </div>

                    <div className="blog-filter-container">
                        <label htmlFor="time-filter" className="filter-label">Okres:</label>
                        <select
                            id="time-filter"
                            className="form-select"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            disabled={sortBy === "likeCount" || sortBy === "replyCount"}
                        >
                            <option value="allTime">Zawsze</option>
                            <option value="lastWeek">Ostatni tydzień</option>
                            <option value="lastMonth">Ostatni miesiąc</option>
                        </select>
                    </div>

                    {(sortBy === "likeCount" || sortBy === "replyCount") && (
                        <p className="filter-notice">
                            Sortowanie po polubieniach/odpowiedziach wyłącza filtr okresu.
                        </p>
                    )}
                </div>
            )}

            {showForm && <CreatePostForm onPostCreated={handlePostCreated} />}

            <div className="post-list">
                {loading ? (
                    <LoadingSpinner />
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
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
                                <span className="post-date">
                                    {formatPostTimestamp(post.createdAt)}
                                </span>
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
                    <p>
                        {posts.length > 0 && searchTerm
                            ? 'Nie znaleziono postów pasujących do Twojego wyszukiwania.'
                            : 'Nie ma jeszcze żadnych postów. Bądź pierwszy!'}
                    </p>
                )}
            </div>
        </div >
    );
};

export default BlogListPage;