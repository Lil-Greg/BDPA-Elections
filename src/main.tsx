import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Top from './components/Top.tsx'
import ElectionPage from './pages/election/ElectionPage.tsx'
import UserContextProvider from './context/UserContextProvider.tsx';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import AuthPage from './pages/auth/AuthPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import HistoryPage from './pages/history/HistoryPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import CreateElectionPage from './pages/create-election/CreateElectionPage.tsx';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage /> //<ProtectedRoute allowedUserTypes={['voter', 'administrator', 'moderator', 'reporter', 'super']}></ProtectedRoute>
  }, {
    path: '/create-election',
    element: <CreateElectionPage />//<ProtectedRoute allowedUserTypes={['administrator', 'super']}></ProtectedRoute>
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
    <ConvexProvider client={convex}>
      <UserContextProvider>
        <Top />
        <RouterProvider router={router}></RouterProvider>
      </UserContextProvider>
    </ConvexProvider>
  </React.StrictMode>,
)

