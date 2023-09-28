import React from "react";
import { useParams } from 'react-router-dom';

export default function BookDetail() {
  const { bookName } = useParams(); 

  return (
    <div>
      <h1>You clicked on {bookName}</h1>
    </div>
  );
}
