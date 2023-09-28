


import React, { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setBooks([]);
      return;
    }

    
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        if (data.docs) {
          setBooks(data.docs);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setBooks([]);
      });
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <h1>Welcome </h1>
      <h1>Search your book here 👇</h1>
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {books.map((book) => (
          <li key={book.key}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}



