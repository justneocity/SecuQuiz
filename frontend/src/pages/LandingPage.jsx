import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Make sure to create a corresponding CSS file
import lockGif from '../lock.gif';

function LandingPage () {
  return (
    <>
    <div className="landing-page">
      <h1>Test your security skills or practice with your class</h1>
      <p>Make sure to Register or Log In so you can try the challenges.</p>
      <div className="landing-actions">
        <Link to="/signup" className="register-btn">Register</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
      <div className="overlay">
        <img src={lockGif} alt="Be patient..." />
      </div>
    </div>
    <footer>
      Created by Rifa Jamal for COMP6841 Something Awesome Project
    </footer>
    </>
  );
}

export default LandingPage;
