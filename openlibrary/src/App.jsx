import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import wretch from 'wretch';
import * as s from '@carbon/react';
import { appPageData, appPageError, searchIsLoading } from './atomPage';
import './App.scss';

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
        <div key={item.key} className="book-item">
          <p>
            <Link to={`${item.key}`} className="book-link">
              {item.title}

              <span className="book-author">
                {item.author_name && item.author_name.length > 0
                  ? ` written by ${item.author_name[0]}`
                  : null}
              </span>
              <span className="book-year">
                {item.first_publish_year
                  ? ` (${item.first_publish_year})`
                  : null}
              </span>
            </Link>
          </p>
        </div>
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
      <s.Grid className="SearchBar" fullWidth>
        <s.Column lg={12} md={8} sm={4} className="SearchBar_">
          <s.Search
            type="text"
            placeholder="Search here"
            value={bookcase}
            onChange={handleChange}
            size="md"
          />
        </s.Column>
        <s.Column lg={4} md={4} sm={4} className="SearchBar__button">
          <s.Button className="SearchButton" onClick={handleClick}>
            Submit
          </s.Button>
        </s.Column>
      </s.Grid>
      <s.Column lg={16} md={8} sm={4} className="SearchBar__list">
        {loading && <div>Loading... Please wait</div>}
        {error && (
          <div>{`There is a problem fetching data - ${error}`}</div>
        )}
        {Items && <s.ContainedList>{Items}</s.ContainedList>}
      </s.Column>
    </div>
  );
}
