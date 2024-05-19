import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import Navbar from './components/Navabar.tsx'
import ElectionPage from './pages/ElectionPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <App />
      }, {
        path: '/election',
        element: <ElectionPage />
      }
    ]
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
