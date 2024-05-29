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
import HistoryPage from './pages/HistoryPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import CreateElectionPage from './pages/CreateElectionPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute allowedUserTypes={['voter', 'administrator', 'moderator', 'reporter', 'super']}>
      <DashboardPage />
    </ProtectedRoute>
  }, {
    path: '/create-election',
    element: <ProtectedRoute allowedUserTypes={['administrator', 'super']}><CreateElectionPage /></ProtectedRoute>
  }, {
    path: '/history',
    element: <HistoryPage />// <ProtectedRoute allowedUserTypes={['voter', 'administrator', 'super']}><HistoryPage /></ProtectedRoute>,

  }, {
    path: '/history/:electionId',
    element: <ElectionPage /> //<ProtectedRoute allowedUserTypes={['voter', 'administrator', 'reporter', 'super']}><ElectionPage /></ProtectedRoute>
  }, {
    path: '/login',
    element: <AuthPage />
  }, {
    path: '/register',
    element: <RegisterPage /> //<ProtectedRoute allowedUserTypes={['administrator', 'super']}><RegisterPage /></ProtectedRoute>
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

