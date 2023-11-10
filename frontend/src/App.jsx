import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Ensure this is the correct path to your AuthContext file
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import './App.css';

function App () {
  return (
      <AuthProvider>
        <Router>
          <div className="App"> 
            <NavBar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/summary" element={<SummaryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
