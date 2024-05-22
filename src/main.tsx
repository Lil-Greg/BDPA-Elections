import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Top from './components/Top.tsx'
import ElectionPage from './pages/ElectionPage.tsx'
import UserContextProvider from './context/UserContextProvider.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  }, {
    path: '/election',
    element: <ProtectedRoute><ElectionPage /></ProtectedRoute>
  }, {
    path: '/login',
    element: <AuthPage />
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Top />
      <RouterProvider router={router}></RouterProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
