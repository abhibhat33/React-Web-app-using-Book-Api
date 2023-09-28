// import usestate from 'react';

// export default function pr(){
//   const [searchTerm, setSearchTerm] = usestate('')
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value)
//   }
  
//   return (
//     <div>
//       <h1>Welcome  </h1>
//       <h1>You can search the book here 👇</h1>
//       <input 
//          type = "text"
//          placeholder = "Search for a book..."
//          value = {searchTerm}
//          onChange = {handleSearchChange}
//          />

//     </div>
//   )
// //

// import  { useState } from 'react';
// import './App.css'


// export default function MainApp() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
//   return (
//     <div className='center'>
//       <h1>Welcome </h1>
//       <h1>You can search the book here 👇</h1>
//       <input
//         type="text"
//         placeholder="Search for a book..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       <h1>{searchTerm}</h1>
      
      
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import './App.css';

// export default function App() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [bookData, setBookData] = useState([]);
//   useEffect(() => {
//     const apiUrl = 'https://openlibrary.org/search.json'
    
//     const fetchData = async () => {
//       try {
//         const response = await fetch(apiUrl + encodeURIComponent(searchTerm));
//         if (response.ok) {
//           const data = await response.json();
//           setBookData(data);
//         } else {
//           console.error('Error fetching data from the API');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };
   
//     if (searchTerm !== '') {
//       fetchData();
//     } else {
//       // If the search term is empty, clear the book data
//       setBookData([]);
//     }
//   }, [searchTerm]);
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
//   return (
//     <div className="center-container">
//       <h1>Welcome to Book Repo</h1>
//       <input
//         type="text"
//         placeholder="Search for a book..."
//         value={searchTerm}
//         onChange={handleSearchChange}
//       />
//       {bookData.length > 0 && (
//         <div>
//           <h2>Matching Books:</h2>
//           <ul>
//             {bookData.map((book) => (
//               <li key={book.id}>{book.name}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setBooks([]);
      return;
    }

    
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=5`)
      .then((response) => response.json())
      .then((data) => {
        if (data.docs) {
          setBooks(data.docs);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setBooks([]);
      });
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <h1>Welcome </h1>
      <h1>Search your book here 👇</h1>
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {books.map((book) => (
          <li key={book.key}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
}



