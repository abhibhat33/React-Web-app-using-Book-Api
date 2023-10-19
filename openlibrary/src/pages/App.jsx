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
      <s.Grid fullWidth>
        <s.Column lg={16} md={8} sm={4}>
          <s.Column lg={2} md={1} sm={1}>
            <h1>Search your book here</h1>
          </s.Column>
          <s.Column lg={6} md={4} sm={2} className="SearchBar">
            <s.Grid className="Search" narrow>
              <s.Column lg={4} md={3} sm={2} className="SearchBar__input">
                <s.Search
                  type="text"
                  placeholder="Search here"
                  value={bookcase}
                  onChange={handleChange}
                  size="md"
                />
              </s.Column>
              <s.Column lg={2} md={1} sm={2} className="SearchBar__button">
                <s.Button className="SearchButton" onClick={handleClick} size="md">
                  Search
                </s.Button>
              </s.Column>
            </s.Grid>
          </s.Column>
          <s.Column lg={8} md={3} sm={2} className="BookInfoContainer" style={{ marginRight: '20px' }} narrow>
            {loading && <div><h4>Loading... Please wait</h4></div>}
            {error && <div>{`Problem while fetching data - ${error}`}</div>}
            {Items && <s.ContainedList className="BookItems">{Items}</s.ContainedList>}
          </s.Column>
        </s.Column>
      </s.Grid>
    </div>
  );
}

//   return (
//     <div className="App">
//       <s.Grid fullWidth>
//         <s.Column lg={16} md={8} sm={4}>
//           <h1>Search your book here</h1>
//         </s.Column>
//         <s.Column lg={14} md={8} sm={8} className="SearchBar">
//           <s.Grid className="Sear" narrow>
//             <s.Column lg={10} md={6} sm={6} className="SearchBar__input">
//               <s.Search
//                 type="text"
//                 placeholder="Search here"
//                 value={bookcase}
//                 onChange={handleChange}
//                 size="md"
//               />
//             </s.Column>
//             <s.Column lg={4} md={2} sm={2} className="SearchBar__button">
//               <s.Button className="SearchButton" onClick={handleClick} size="md">
//                 Search
//               </s.Button>
//             </s.Column>
//           </s.Grid>
//         </s.Column>
//         <s.Column lg={12} md={8} sm={4} className="BookInfoContainer">
//           {' '}
//           {loading && <div><h4>Loading... Please wait</h4></div>}
//           {error && <div>{`Problem while fetching data - ${error}`}</div>}
//           {Items && <s.ContainedList className="BookItems">{Items}</s.ContainedList>}
//         </s.Column>
//       </s.Grid>
//     </div>
//   );
// }
