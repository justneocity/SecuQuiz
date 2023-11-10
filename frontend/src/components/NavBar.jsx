import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Navigate to landing page when logout
  };

  return (
    <nav className="navBar">
      <div className="nav-left">
        <Link to="/" className="title">SecuQuiz</Link>
      </div>
      <div className="nav-right">
        <Link to="/dashboard" className="dashboard">Dashboard</Link>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">| Login</Link>
            <Link to="/signup">| Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
