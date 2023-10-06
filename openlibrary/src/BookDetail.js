import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import wretch from 'wretch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import placeholderImage from './placeHolderUrl';

export default function BookDetail(){
  const params = useParams();
  const { key } = params;
  const { keyId } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let title; let bookDescription; let subjects; let
    coverUrl;

  useEffect(() => {
    wretch(`https://openlibrary.org/${key}/${keyId}.json`)
      .get()
      .json()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(`This is an HTTP error: The status is ${error.message}`);
        setLoading(false);
      });
  }, [key, keyId]);

  if (data){
    if (data.title){
      title = data.title;
    }
    if (data.description !== undefined){
      if (data.description.value !== undefined){
        bookDescription = (
          <>
            <h2>Description</h2>
            <p>{data.description.value}</p>
          </>
        );
      } else {
        bookDescription = (
          <>
            <h2>Description</h2>
            <p>{data.description}</p>
          </>
        );
      }
    }
    if (data.subjects !== undefined){
      subjects = (
        <>
          <h2>Subjects</h2>
          <p>{data.subjects.join(', ')}</p>
        </>
      );
    }
    if (data.covers && data.covers.length > 0){
      const coverId = data.covers[0];
      coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    }
  }

  return (
    <div>
      <div className="Title">
        <b>
          <h1>
            {title}
            {' '}
          </h1>
        </b>
      </div>
      {coverUrl
        ? (
          <div className="Img">
            <LazyLoadImage
              effect="black-and-white"
              src={coverUrl}
              alt="Book cover"
              height="300px"

              placeholderSrc={placeholderImage}
            />
          </div>
        )
        : null}

      <div>{subjects}</div>
      <div className="Description">{bookDescription}</div>

    </div>
  );
}
