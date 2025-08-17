import React, { useEffect, useState } from 'react';
import './App.css';


const Vocabulary = () => {
  const [words, setWords] = useState([]);
  const [showMeaning, setShowMeaning] = useState(false); // false = hidden, true = show
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    setLoading(true);
    const isDev = import.meta.env.VITE_ENV === 'dev';
    const apiUrl = isDev ? import.meta.env.VITE_API_URL_DEV : window.location.origin+ '/api';
    let response = await fetch(`${apiUrl}/scrape/vocabulary?all=true`);
    response = await response.json();
    // Expecting response to be array of { word, meaning }
    console.log(response);
    setWords(response);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">All Vocabulary Words</h1>
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '1.1rem', color: '#333', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1.5rem', borderRadius: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <span>Hide Meanings</span>
            <input
              type="checkbox"
              checked={!showMeaning}
              onChange={() => setShowMeaning((v) => !v)}
              style={{ width: 24, height: 24 }}
            />
            <span>Show Meanings</span>
          </label>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#667eea', fontWeight: 600 }}>Loading...</div>
        ) : (
          <div className="vocab-chips" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            {words.map((item, idx) => (
              <div key={idx} className="vocab-chip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.97)' }}>
                <span style={{ fontWeight: 600 }}>{item.word}</span>
                {showMeaning && (
                  <span style={{ marginLeft: '2rem', color: '#764ba2', fontWeight: 400, fontSize: '1rem' }}>{item.definition}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;
