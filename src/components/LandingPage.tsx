import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome to the Landing Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LandingPage;
