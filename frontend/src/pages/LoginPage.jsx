import React, { useState, useContext } from 'react';
import { TextField, Button, Card, CardContent, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LoginPage () {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token, email);
        navigate('/dashboard');
      } else {
        throw new Error('Failed to login: Email or password is incorrect');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Login</Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <div>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Login
          </Button>
          <Typography style={{ marginTop: '20px' }}>
            Don&apos;t have an account?
            <Link
              component="button"
              variant="body2"
              onClick={navigateToSignup}
              style={{ marginLeft: '5px' }}
            >
              Sign up now
            </Link>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
