import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider /*, linkedInProvider */ } from '../firebaseConfig';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    // OAuthProvider
} from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';
import './LoginPage.css';

const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>;
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-3.1v8.7h3.1v-4.35c0-.9.6-1.63 1.63-1.63s1.64.73 1.64 1.63v4.35h3.11zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 10.14v-8.7H5.5v8.7h2.77z"></path></svg>;

/**
 * PL: Komponent strony logowania/rejestracji (tylko wygląd).
 * EN: Login/Registration page component (visuals only).
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    if (currentUser) {
        navigate('/edytor');
        return null;
    }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getFriendlyErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Nieprawidłowy format adresu e-mail.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Nieprawidłowy e-mail lub hasło.';
            case 'auth/email-already-in-use':
                return 'Ten adres e-mail jest już zarejestrowany.';
            case 'auth/weak-password':
                return 'Hasło jest zbyt słabe (minimum 6 znaków).';
            default:
                return 'Wystąpił błąd logowania lub rejestracji. Spróbuj ponownie.';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateUserProfile(userCredential.user);
            navigate('/edytor');
        } catch (err) {
            console.error("Błąd rejestracji:", err.code, err.message);
            setError(getFriendlyErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await updateUserProfile(userCredential.user);
            navigate('/edytor');
        } catch (err) {
            console.error("Błąd logowania:", err.code, err.message);
            setError(getFriendlyErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await updateUserProfile(result.user);
            navigate('/edytor');
        } catch (err) {
            console.error("Błąd logowania Google:", err.code, err.message);
            if (err.code === 'auth/account-exists-with-different-credential') {
                setError('Konto z tym adresem e-mail już istnieje. Spróbuj zalogować się inną metodą.');
            } else {
                setError("Nie udało się zalogować przez Google.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = () => {
        setError("");
        setLoading(true);
        console.log("LinkedIn Login button clicked");
        alert("LinkedIn Login functionality (Firebase) not connected yet.");
        setTimeout(() => setLoading(false), 1000);
    };

    /**
     * PL: Zapisuje lub aktualizuje dane użytkownika w kolekcji 'users' w Firestore.
     * EN: Saves or updates user data in the 'users' collection in Firestore.
     */
    const updateUserProfile = async (user) => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || email.split('@')[0],
                lastLogin: serverTimestamp(),
            }, { merge: true });
            console.log("Profil użytkownika zapisany/zaktualizowany w Firestore.");
        } catch (error) {
            console.error("Błąd zapisu profilu użytkownika w Firestore:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Logowanie / Rejestracja</h2>
            <p className="login-error">{error || ""}</p>

            <form onSubmit={handleLogin}>
                <div className="login-form-group">
                    <label htmlFor="email">Adres e-mail</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-form-group">
                    <label htmlFor="password">Hasło</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="login-button btn-login-email" disabled={loading}>
                        {loading ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                    <button type="button" onClick={handleRegister} className="login-button btn-register" disabled={loading}>
                        {loading ? 'Rejestracja...' : 'Zarejestruj się'}
                    </button>
                </div>
            </form>

            <div className="login-separator">lub</div>

            <button onClick={handleGoogleLogin} className="login-button btn-google" disabled={loading}>
                <GoogleIcon /> Zaloguj się przez Google
            </button>


        </div>
    );
};

export default LoginPage;