import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import wretch from 'wretch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { Grid, Column } from '@carbon/react';
import PlaceholderImage from './placeHolderUrl';
import './BookDetail.scss';

export default function Book(){
  const params = useParams();
  const { key } = params;
  const { keyId } = params;
  const [data, setData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  useEffect(() => {
    wretch(`https://openlibrary.org/${key}/${keyId}.json`)
      .get()
      .json()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(`This is an HTTP error: The status is ${e.message}`);
        setLoading(false);
      });
  }, [key, keyId]);
  let title;
  let bookDescription;
  let subjects;
  let imageSrc;
  if (data){
    if (data.title){
      title = <h1 className="book-title">{data.title}</h1>; // Updated to use an h1 tag for the title
    }
    if (data.description !== undefined){
      bookDescription = (
        <div className="Description">
          <h4>Description</h4>
          <p className="book-description">{data.description.value || data.description}</p>
        </div>
      );
    }
    if (data.subjects !== undefined){
      subjects = (
        <div className="Subjects">
          <h4>Subjects</h4>
          <p className="book-subjects">{data.subjects.join(', ')}</p>
        </div>
      );
    }
    if (data.covers && data.covers.length > 0){
      imageSrc = `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`;
    }
  }
  return (
    <Grid fullWidth>
      <Column lg={4} md={4} sm={4} className="book-cover">
        {imageSrc && (
          <LazyLoadImage
            effect="black-and-white"
            src={imageSrc}
            alt="Book cover"
            height="400px"
            placeholderSrc={<PlaceholderImage />}
          />
        )}
      </Column>
      <Column lg={12} md={12} sm={12} className="book-details">
        {title}
        {subjects}
        {bookDescription}
      </Column>
    </Grid>
  );
}
