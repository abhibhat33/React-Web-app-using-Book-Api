import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import wretch from 'wretch';
import * as s from '@carbon/react';
import { appPageData, appPageError, searchIsLoading } from '../atomPage';
import '../styles/App.scss';

export default function App(){
  const [bookcase, setBookname] = useState('');
  const [data, setData] = useRecoilState(appPageData);
  const [loading, setLoading] = useRecoilState(searchIsLoading);
  const [error, setError] = useRecoilState(appPageError);

  let Items;

  function handleChange(e){
    setBookname(e.target.value);
  }

  function handleClick(){
    setLoading(true);

    const encodedBookName = encodeURIComponent(bookcase);

    wretch(`https://openlibrary.org/search.json?q=${encodedBookName}&limit=8`)
      .get()
      .json()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        setError(`This is an HTTP error: The status is ${err.message}`);
        setLoading(false);
      });
  }

  if (data){
    if (data.docs && data.docs.length !== 0){
      Items = data.docs.map((item) => (
        <Link to={`${item.key}`} key={item.key} className="book-item">
          <div>
            <p className="book-name">
              <span>{item.title}</span>
            </p>
            <p className="book-details">
              {item.author_name && item.author_name.length > 0 ? `by ${item.author_name[0]}` : null}
              {item.first_publish_year ? ` (${item.first_publish_year})` : null}
            </p>
          </div>
        </Link>
      ));
    } else {
      Items = <div className="no-books">No book found!</div>;
    }
  } else {
    Items = null;
  }

  return (
    <div className="App">
      <h1>Search your book here</h1>
      <div className="SearchBar">
        <div className="SearchBar__input">
          <s.Search
            type="text"
            placeholder="Search here"
            value={bookcase}
            onChange={handleChange}
            size="md"
          />
        </div>
        <div className="SearchBar__button">
          <s.Button className="SearchButton" onClick={handleClick}>
            Search
          </s.Button>
        </div>
      </div>
      <div className="BookInfoContainer">
        {loading && <div><h4>Loading... Please wait</h4></div>}
        {error && <div>{`Problem while fetching data - ${error}`}</div>}
        {Items && <s.ContainedList>{Items}</s.ContainedList>}
      </div>
    </div>
  );
}
