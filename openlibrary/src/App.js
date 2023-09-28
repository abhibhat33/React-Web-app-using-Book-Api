import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.trim() === '') {
      setBooks([]);
      return;
    }

    fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=6`)
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
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <h1>Welcome</h1>
      <h1>Search your book here</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.key}>
            <Link to={`/book/${book.title}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

