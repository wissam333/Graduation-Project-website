import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import api from './api';

function Login({ onLoginSuccess }) {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const username = useRef(null);
  const password = useRef(null);

  const logIn = async (username, password) => {
    try {
      setEmailError('');
      setPasswordError('');
      document.getElementById("login-email-error").style.display = "none";
      document.getElementById("login-password-error").style.display = "none";

      const response = await api.post('auth/login', { username, password });

      // Store auth data
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      // Let App.js know we're logged in
      if (onLoginSuccess) {
        onLoginSuccess(); // triggers re-check of auth in App.js
      }

      // Navigate after short delay to ensure user state is updated
      setTimeout(() => {
        navigate('/myfood/categories');
      }, 50);
    } catch (err) {
      document.getElementById("login").classList.remove('disable');

      if (err.response) {
        const error = err.response.data.error;
        if (error === 'User not found') {
          document.getElementById("login-email-error").style.display = "block";
          setEmailError('User not found');
        } else if (error === 'Wrong password') {
          document.getElementById("login-password-error").style.display = "block";
          setPasswordError('Wrong password');
        }
      } else {
        console.error('Network error:', err.message);
      }
    }
  };

  const onHandleChange = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("login");
    if (btn) btn.classList.add('disable');

    const usernameValue = username.current?.value;
    const passwordValue = password.current?.value;

    if (usernameValue && passwordValue) {
      await logIn(usernameValue, passwordValue);
    }
  };

  return (
    <div className="flex-container-3">
      <div id="part-1">
        <h1>my food</h1>
      </div>
      <div id="part-2">
        <h1 style={{ marginBottom: "15vh" }}>Log in</h1>
        <form onSubmit={onHandleChange}>
          <label htmlFor="email">Name</label>
          <input type="text" id="email" ref={username} required />
          <p id="login-email-error" className="error">{emailError}</p>

          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={password} required />
          <p id="login-password-error" className="error">{passwordError}</p>

          <div>
            <button type="submit" className="submit" id="login">Log In</button>
          </div>

          <NavLink to='/myfood/register'>Don't have an account?</NavLink>
        </form>
      </div>
    </div>
  );
}

export default Login;
