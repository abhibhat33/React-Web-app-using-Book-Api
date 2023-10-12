import { React, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './styles/index.scss';
import App from './pages/App';
import Book from './pages/BookDetail';

const container = document.getElementById('root');
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path:    '/',
    element: <App />,

  },
  {
    path:    '/:key/:keyId',
    element: <Book />,

  }
]);

root.render(
  <StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
