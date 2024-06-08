import { useContext } from 'react';
import './App.css';
import UserContext from './context/UserContext';
import DashboardPage from './pages/dashboard/DashboardPage';
import AuthPage from './pages/auth/AuthPage';

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? (<DashboardPage />) : (<AuthPage />)}
    </>

  )
}


export default App
