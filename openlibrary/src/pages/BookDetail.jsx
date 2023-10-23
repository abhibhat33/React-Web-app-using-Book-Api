import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import wretch from 'wretch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Grid, Column } from '@carbon/react';
import Markdown from 'react-markdown';
import PlaceholderImage from '../placeHolderUrl';
import '../styles/BookDetail.scss';

export default function BookDetail(){
  const params = useParams();
  const { key, keyId } = params;
  const [data, setData] = useState(null);
  const [authorData, setAuthorData] = useState([]);

  useEffect(() => {
    wretch(`https://openlibrary.org/${key}/${keyId}.json`)
      .get()
      .json()
      .then((bookData) => {
        setData(bookData);
      })
      .catch((e) => {
        console.error(`This is an HTTP error: The status is ${e.message}`);
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
  const bookDescription = data && data.description
  !== undefined ? data.description.value || data.description : null;
  const subjects = data && data.subjects !== undefined ? data.subjects.join(', ') : null;

  const imageSrc = data && data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg` : null;

  return (
    <Grid className="BookPage" fullWidth>
      <Column lg={14} md={7} sm={4} className="b">
        <Grid className="Book__">
          <Column lg={4} md={2} sm={1} className="book-cover">
            {imageSrc && (
              <LazyLoadImage effect="opacity" src={imageSrc} className="Book-src" alt="Book cover" height="auto" width="100%" placeholderSrc={<PlaceholderImage />} />
            )}
          </Column>
          <Column lg={10} md={5} sm={4} className="book-details">
            <Grid className="BookPage" fullWidth>
              <Column lg={10} md={4} sm={4} className="BookPage_title">
                <h1>{bookTitle}</h1>
              </Column>
              <Column lg={10} md={4} sm={4} className="author_book">
                {authorData.length > 0 && (
                  <h3>
                    by
                    {' '}
                    {authorData.join(', ')}
                  </h3>
                )}
              </Column>
              <Column lg={10} md={4} sm={4} className="book-subjects">
                {subjects && (
                  <div>
                    <h4>Subjects</h4>
                    <p>
                      {subjects.length > 500 ? `${subjects.slice(0, 500)}...` : subjects}
                    </p>
                  </div>
                )}
              </Column>
              <Column lg={10} md={4} sm={4} className="Description">
                {bookDescription && (
                  <div>
                    <h4>Description</h4>
                    <p>
                      <Markdown>
                        {bookDescription}
                      </Markdown>
                    </p>
                  </div>
                )}
              </Column>
            </Grid>
          </Column>
        </Grid>
      </Column>
    </Grid>
  );
}
