import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Typography, Link } from '@mui/material';
import { AuthContext } from '../AuthContext';

function SignupPage () {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5005/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.status === 409) {
        // Email already exists
        throw new Error('Email already exists. Please log in or use a different email.');
      } else if (!response.ok) {
        throw new Error('Failed to sign up. Please try again.');
      }
      
      const data = await response.json();
      console.log(data.message);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Sign Up</Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          margin="normal"
          fullWidth
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          fullWidth
          style={{ marginTop: '20px' }}
        >
          Sign Up
        </Button>
        <Typography style={{ marginTop: '20px' }}>
          Already have an account? 
          <Link 
            component="button" 
            variant="body2" 
            onClick={navigateToLogin} 
            style={{ marginLeft: '5px' }}
          >
            Login here
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SignupPage;
