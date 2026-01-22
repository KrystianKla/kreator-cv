import React, { useState } from 'react';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebaseConfig'; 
import './FormStyles.css';

const DocumentsForm = () => {
  const { cvData, addDocument, removeDocument } = useCV();
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    setIsUploading(true);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = ref(storage, `users/${currentUser.uid}/documents/${fileName}`);

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const newDoc = {
        id: fileName, 
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        date: new Date().toLocaleDateString(),
        url: downloadURL,
        storagePath: fileRef.fullPath 
      };

      addDocument(newDoc);
    } catch (error) {
      console.error("Błąd przesyłania:", error);
      alert("Wystąpił błąd podczas wgrywania pliku.");
    } finally {
      setIsUploading(false);
      e.target.value = ""; 
    }
  };

  const handleDeleteFile = async (docId, storagePath) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten dokument?")) return;

    try {
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      }
      removeDocument(docId);
    } catch (error) {
      console.error("Błąd usuwania:", error);
      alert("Błąd podczas usuwania pliku z serwera.");
    }
  };

  return (
    <div className="documents-modal-content">
      <div className="info-box-mini">
        <span className="info-box-icon">💡</span>
        <div>
          <h4>Zarządzaj dokumentami</h4>
          <p>Dodaj certyfikaty, dyplomy lub inne ważne pliki PDF.</p>
        </div>
      </div>

      <div className="upload-zone-modal">
        <input 
          type="file" 
          id="pdf-upload-modal" 
          accept="application/pdf" 
          onChange={handleFileChange}
          className="hidden-file-input"
          disabled={isUploading}
        />
        <label htmlFor="pdf-upload-modal" className={`btn-add-file-styled ${isUploading ? 'loading' : ''}`}>
          <span className="icon">{isUploading ? '⏳' : '➕'}</span> 
          {isUploading ? 'Wgrywanie pliku...' : 'Dodaj plik PDF'}
        </label>
      </div>

      <div className="documents-list-modal">
        {cvData.documents && cvData.documents.map((doc) => (
          <div key={doc.id} className="document-card-horizontal">
            <div className="doc-main-group">
              <div className="pdf-badge">PDF</div>
              <div className="doc-details">
                <p className="doc-name-text" title={doc.name}>{doc.name}</p>
                <p className="doc-meta-text">{doc.date} • {doc.size}</p>
              </div>
            </div>
            
            <div className="doc-actions-group">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="action-icon-btn view" title="Podgląd">
                👁️
              </a>
              <a href={doc.url} download={doc.name} className="action-icon-btn download" title="Pobierz">
                📥
              </a>
              <button 
                type="button"
                className="action-icon-btn delete" 
                onClick={() => handleDeleteFile(doc.id, doc.storagePath)}
                title="Usuń"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {(!cvData.documents || cvData.documents.length === 0) && !isUploading && (
          <p className="no-docs-text">Brak dodanych dokumentów.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentsForm;