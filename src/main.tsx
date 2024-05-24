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
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  }, {
    path: '/election',
    element: <ElectionPage />, //<ProtectedRoute><ElectionPage /></ProtectedRoute>
  }, {
    path: '/create-election',
    element: <CreateElectionPage />
  }, {
    path: '/history',
    element: <HistoryPage /> //<ProtectedRoute><HistoryPage /></ProtectedRoute>
  }, {
    path: '/login',
    element: <AuthPage />
  }, {
    path: '/register',
    element: <RegisterPage />
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

