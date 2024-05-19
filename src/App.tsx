import { useContext } from 'react';
import './App.css';
import UserContext from './context/UserContext';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? (<DashboardPage />) : (<AuthPage />)}
    </>
  )
}

export default App
