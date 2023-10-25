import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import wretch from 'wretch';
import {
  Grid, Column, ContainedList, Search, Button
} from '@carbon/react';
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
          <div className="book-item-content">
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
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <Column lg={2} md={1} sm={1}>
            <h1>Search your book here</h1>
          </Column>
          <Column lg={6} md={4} sm={2} className="SearchBar">
            <Grid className="Search" narrow>
              <Column lg={4} md={3} sm={2} className="SearchBar__input">
                <Search
                  type="text"
                  placeholder="Search here"
                  value={bookcase}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={handleChange}
                  size="md"
                />
              </Column>
              <Column lg={2} md={1} sm={2} className="SearchBar__button">
                <Button
                  className="SearchButton"
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={handleClick}
                  size="md"
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </Column>
            </Grid>
          </Column>
          <Column lg={8} md={3} sm={2} className="BookInfoContainer" style={{ marginRight: '20px' }} narrow>
            {error && <div>{`Problem while fetching data - ${error}`}</div>}
            {!loading && Items && <ContainedList className="BookItems">{Items}</ContainedList>}
          </Column>
        </Column>
      </Grid>
    </div>
  );
}
