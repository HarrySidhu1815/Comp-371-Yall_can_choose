import { useState } from 'react';
import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault();
    const response = await fetch('http://localhost:1337/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();
    if (data.user) {
      alert('Login Successful');
      navigate('/add')
    } else {
      alert('Please try again! Check your username and password');
    }
  }
  return (
    <div className="container"> {/* Added class name for styling */}
      <h1>Login for UniFlip</h1>
      <form onSubmit={loginUser}>
        <input
          placeholder='Email'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <br />
        <br />
        <input
          placeholder='Password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <br />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}

export default Login;
