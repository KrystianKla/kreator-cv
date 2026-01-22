# 📄 Kreator CV z Modułem Społecznościowym

Nowoczesna aplikacja webowa typu **SPA (Single Page Application)**, która łączy w sobie intuicyjne narzędzie do budowania profesjonalnych życiorysów z platformą wymiany doświadczeń zawodowych.

---

## 🚀 Główne Funkcjonalności

- ⚡ **Interaktywny kreator**  
  Dynamiczne formularze z natychmiastową walidacją danych.

- 👁️ **Live Preview (WYSIWYG)**  
  Podgląd dokumentu CV w formacie A4 aktualizowany w czasie rzeczywistym.

- 📁 **Eksport do PDF**  
  Generowanie gotowych do druku plików PDF bezpośrednio w przeglądarce.

- 🤝 **Moduł społecznościowy**  
  Forum dyskusyjne z kategoriami:
  - Pytania
  - Oferty pracy
  - Dyskusja

- ❤️ **Interakcje użytkowników**
  - Lajkowanie postów
  - Dodawanie odpowiedzi w wątkach

- 🔒 **Bezpieczeństwo**
  - Autoryzacja e-mail / hasło
  - Logowanie przez Google (Google SDK)

---

## 🛠️ Stack Technologiczny

| Warstwa              | Technologia |
|----------------------|-------------|
| **Frontend**         | React.js (Hooks, Context API) |
| **Backend / Database** | Firebase (Firestore, Authentication) |
| **Stylizacja**       | CSS3 (Flexbox, Grid, Custom Properties) |
| **Narzędzia**        | Vite, Lucide React, Firebase Tools |

---

## 📦 Instalacja i Uruchomienie

### 1️⃣ Przygotowanie środowiska

- Zainstaluj **Node.js (LTS)**  
  👉 https://nodejs.org/
- Zainstaluj **Visual Studio Code**
  👉 https://code.visualstudio.com

---

### 2️⃣ Pobranie projektu

1. Pobierz projekt jako **ZIP** z GitHub
2. Rozpakuj archiwum
3. W VS Code wybierz:
File → Open Folder
4. Wskaż katalog projektu

---

### 3️⃣ Instalacja i uruchomienie

Otwórz terminal w VS Code (`Ctrl + ``) i wykonaj:

# Instalacja zależności
npm install

# Uruchomienie trybu deweloperskiego
npm run dev
Aplikacja będzie dostępna domyślnie pod adresem:
👉 http://localhost:5173

## 🔑 Konfiguracja Firebase

Aplikacja wymaga połączenia z usługą **Firebase**.

### Kroki konfiguracji

1. W katalogu głównym projektu odszukaj plik o nazwie .env.example. 
2. Zmień jego nazwę na .env. 
3. Zaloguj się do Firebase Console, wejdź w ustawienia swojego projektu i skopiuj parametry z sekcji SDK Setup and configuration. 
4. Wejdź do konsoli Firebase: Zaloguj się na console.firebase.google.com i kliknij w swój projekt. 
5. Otwórz Ustawienia: W menu po lewej stronie, na samej górze, obok napisu „Project Overview”, kliknij w ikonę koła zębatego i wybierz General. 
6. Sekcja „Twoje aplikacje” (Twoja baza): Na karcie „General” przewiń stronę na sam dół do sekcji Your apps. Zobaczysz tam ikonę </> (aplikacja webowa). 
7. Wybierz widok „Config”: Pod nazwą Twojej aplikacji zobaczysz kilka opcji do wyboru (npm, CDN, Config). Wybierz Config. Wyświetli się kod, który musisz przepisać do pliku .env. 
8. Uzupełnij plik .env zgodnie z poniższym wzorem: 

.env
REACT_APP_FIREBASE_API_KEY=twoj_klucz
REACT_APP_FIREBASE_AUTH_DOMAIN=twoja_domena
REACT_APP_FIREBASE_PROJECT_ID=id_projektu
REACT_APP_FIREBASE_STORAGE_BUCKET=bucket_storage
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=id_nadawcy
REACT_APP_FIREBASE_APP_ID=id_aplikacji

---

🛠️ Troubleshooting
❌ 'npm' is not recognized as an internal or external command
➡️ Zrestartuj VS Code po instalacji Node.js

❌ PSSecurityException (Windows)
Uruchom PowerShell jako administrator i wykonaj:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

❌ Błąd instalacji paczek
Wyczyść cache npm:
npm cache clean --force

---

📈 Plan Rozwoju (Roadmap)
Projekt jest aktywnie rozwijany. Planowane funkcjonalności:

 📱 Mobile First Responsive Design
Pełna optymalizacja dla urządzeń mobilnych

 🌍 Wielojęzyczność (i18n)
Wersje: EN / DE

 🔗 Integracja z LinkedIn
Automatyczne pobieranie danych zawodowych

 🎨 Biblioteka szablonów CV
Minimum 5 nowych motywów graficznych