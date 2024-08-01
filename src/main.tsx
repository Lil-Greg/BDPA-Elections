import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Top from './components/Top.tsx';
import ElectionPage from './pages/election/ElectionPage.tsx';
import UserContextProvider from './context/UserContextProvider.tsx';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import AuthPage from './pages/auth/AuthPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MultiElectionsPage from './pages/multi-elections/MultiElectionsPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import CreateElectionPage from './pages/create-election/CreateElectionPage.tsx';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import VotingPage from './pages/election/VotingPage.tsx';
import ForgotPassword from './pages/auth/forgotPassword.tsx';
import HistoryPage from './pages/history/HistoryPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaintenancePage from './pages/Maintenance/MaintenancePage.tsx';
// import TopSec from './components/TopSec.tsx';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute allowedUserTypes={['voter', 'administrator', 'moderator', 'reporter', 'super']}><DashboardPage /></ProtectedRoute>
  }, {
    path: '/create-election',
    element: <ProtectedRoute allowedUserTypes={['administrator', 'super']}><CreateElectionPage /></ProtectedRoute>
  }, {
    path: '/elections',
    element: <ProtectedRoute allowedUserTypes={['voter', "reporter", 'administrator', 'super', "moderator"]}><MultiElectionsPage /></ProtectedRoute>,
  }, {
    path: '/elections/:electionId',
    element: <ProtectedRoute allowedUserTypes={['voter', 'administrator', 'super']}><ElectionPage /></ProtectedRoute>
  }, {
    path: '/elections/:electionId/vote',
    element: <ProtectedRoute allowedUserTypes={['voter']}><VotingPage /></ProtectedRoute>
  }, {
    path: '/login',
    element: <AuthPage />
  }, {
    path: '/register',
    element: <RegisterPage />
  }, {
    path: '/forgot',
    element: <ForgotPassword />
  }, {
    path: '/elections/history',
    element: <ProtectedRoute allowedUserTypes={['reporter', 'moderator', 'administrator', 'super', 'voter']}><HistoryPage /></ProtectedRoute>
  },{
    path: '/maintenance',
    element: <MaintenancePage />
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <Top />
          <RouterProvider router={router}></RouterProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </ConvexProvider>
  </React.StrictMode>,
)

