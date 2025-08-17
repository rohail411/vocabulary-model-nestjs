import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [vocabularyWords, setVocabularyWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getRandomWord();
  }, []);

  const getRandomWord = async () => {
    const isDev = import.meta.env.VITE_ENV === 'dev';
    const apiUrl = isDev ? import.meta.env.VITE_API_URL_DEV : window.location.origin+ '/api';
    let response = await fetch(`${apiUrl}/scrape/vocabulary`);
    response = await response.json();
    setVocabularyWords(response);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearchResult(null);
    try {
      const isDev = import.meta.env.VITE_ENV === 'dev';
      const apiUrl = isDev ? import.meta.env.VITE_API_URL_DEV : window.location.origin+ '/api';
      const response = await fetch(`${apiUrl}/scrape/meaning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word: searchTerm })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.error && data.word && data.meaning) {
          setSearchResult({
            word: data.word,
            definition: data.meaning,
            error: true,
            original: searchTerm
          });
        } else {
          setSearchResult({
            word: data.word,
            definition: data.meaning || 'Definition not available',
            error: data.error
          });
        }
      } else {
        setSearchResult({
          word: searchTerm,
          definition: '',
          error: true
        });
      }
    } catch {
      setSearchResult({
        word: searchTerm,
        definition: '',
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Vocabulary Explorer</h1>
          <p className="subtitle">Discover and learn new words every day</p>
          <button className='mt-1' onClick={()=> navigate('/vocabulary')} >Vocabulary</button>
        </header>

        <section className="vocab-section">
          <h2 className="section-title">Today's Vocabulary</h2>
          <div className="vocab-chips">
            {vocabularyWords.map((word, index) => (
              <div key={index} className="vocab-chip">
                {word}
              </div>
            ))}
          </div>
        </section>

        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for any word..."
                className="search-input"
                disabled={loading}
              />
              <button type="submit" className="search-button" disabled={loading}>
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                )}
              </button>
            </div>
          </form>

          {searchResult && (
            <div className="search-result">
              {searchResult.error && searchResult.original ? (
                <div className="warning-result">
                  <h3>Word not found</h3>
                  <p>Showing results for <span className="suggestion">{searchResult.word}</span>:</p>
                  <h3 className="result-word">{searchResult.word}</h3>
                  <p className="result-definition">{searchResult.definition}</p>
                </div>
              ) : searchResult.error ? (
                <div className="error-result">
                  <h3>Word not found</h3>
                  <p>Do you mean <span className="suggestion">{searchResult.word}</span>?</p>
                </div>
              ) : (
                <div className="success-result">
                  <h3 className="result-word">{searchResult.word}</h3>
                  <p className="result-definition">{searchResult.definition}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
