import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import wretch from 'wretch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Grid, Column } from '@carbon/react';
import PlaceholderImage from '../placeHolderUrl';
import '../styles/BookDetail.scss';

function processText(text){
  const englishText = text.replace(/[\u0080-\uFFFF]/g, ' ');
  const withoutLinks = englishText.replace(/https?:\/\/\S+/g, '');
  return withoutLinks;
}

export default function BookDetail(){
  const params = useParams();
  const { key, keyId } = params;
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [authorData, setAuthorData] = useState([]);

  useEffect(() => {
    wretch(`https://openlibrary.org/${key}/${keyId}.json`)
      .get()
      .json()
      .then((bookData) => {
        setData(bookData);
        setLoading(false);
      })
      .catch((e) => {
        setError(`This is an HTTP error: The status is ${e.message}`);
        setLoading(false);
      });
  }, [key, keyId]);

  useEffect(() => {
    if (data && data.authors){
      const authorUrls = data.authors.map((authorObj) => `https://openlibrary.org${authorObj.author.key}.json`);
      const authorPromises = authorUrls.map((url) => wretch(url)
        .get()
        .json((fetchedData) => fetchedData.name));
      Promise.all(authorPromises).then((authorNames) => {
        setAuthorData(authorNames);
      });
    }
  }, [data]);

  const bookTitle = data && data.title ? <h1 className="book-title">{data.title}</h1> : null;
  const bookDescription =    data && data.description !== undefined ? (
    <div className="Description">
      <h4>Description</h4>
      <p className="book-description">{processText(data.description.value || data.description)}</p>
    </div>
  ) : null;
  const subjects =    data && data.subjects !== undefined ? (
    <div className="Subjects">
      <h4>Subjects</h4>
      <p className="book-subjects">
        {processText(
          data.subjects
            .map((subject) => subject.replace(/\d\d\d\d-\d\d-\d\d/g, ''))
            .join(', ')
        )}
      </p>
    </div>
  ) : null;

  const imageSrc = data && data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : null;

  return (
    <Grid fullWidth>
      <Column lg={4} md={4} sm={4} className="book-cover">
        {imageSrc && (
          <LazyLoadImage effect="opacity" src={imageSrc} alt="Book cover" height="450px" placeholderSrc={<PlaceholderImage />} />
        )}
      </Column>
      <Column lg={12} md={12} sm={12} className="book-details">
        <div className="BookPage">
          <Grid className="BookPage_info">
            <Column lg={12} md={4} sm={4} className="title_book">
              <h1>{bookTitle}</h1>
            </Column>
            <Column lg={12} md={4} sm={4} className="author_book">
              {authorData.length > 0 && (
                <h3>
                  by
                  {' '}
                  {authorData.join(', ')}
                </h3>
              )}
            </Column>
          </Grid>

          {subjects}
          {bookDescription}

        </div>
      </Column>
    </Grid>
  );
}
