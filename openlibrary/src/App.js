import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import wretch from 'wretch';
import {
  Button, Search, ContainedList, Grid, Column,
} from '@carbon/react';
import { appPageData, appPageError, searchIsLoading } from './atomPage';
import './App.scss';

export default function App(){
  const [bookname, setBookname] = useState('');
  const [data, setData] = useRecoilState(appPageData);
  const [loading, setLoading] = useRecoilState(searchIsLoading);
  const [error, setError] = useRecoilState(appPageError);

  let Items;

  function handleChange(e){
    setBookname(e.target.value);
  }

  function handleClick(){
    setLoading(true);

    const encodedBookName = encodeURIComponent(bookname);

    wretch(`https://openlibrary.org/search.json?q=${encodedBookName}&limit=15`)
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
      <h1>Welcome</h1>
      <h1>Search your book here👇</h1>
      <Grid className="SearchBar" fullWidth>
        <Column lg={16} md={10} sm={4} className="SearchBar_">
          <Grid className="SearchBar__bar_button">
            <Column lg={12} md={6} sm={4} className="SearchBar__bar">
              <Search
                type="text"
                placeholder="Search here"
                value={bookname}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={handleChange}
                size="md"
              />
            </Column>
            <Column lg={4} md={2} sm={3} className="SearchBar__button">
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <Button className="SearchButton" onClick={handleClick}>
                Submit
              </Button>
            </Column>
          </Grid>
        </Column>
        <Column lg={16} md={8} sm={4} className="SearchBar__list">
          {loading && <div>Loading... Please wait</div>}
          {error && (
            <div>{`There is a problem fetching the post data - ${error}`}</div>
          )}
          {Items && <ContainedList>{Items}</ContainedList> }
        </Column>
      </Grid>
    </div>
  );
}
