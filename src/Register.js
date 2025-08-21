import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles/register_login.css';
import api from './api';

function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Client-side validation
    if (!username || !email || !password || !confirmPassword) {
      setErrors({ general: 'All fields are required' });
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ password: 'Passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('auth/register', {
       username,
        email,
        password,
        
      });

      localStorage.setItem('token', response.data.token);
      navigate('/myfood/login');
    } catch (error) {
      if (error.response && error.response.data) {
        const { error: message } = error.response.data;
        if (message === 'Email already in use') {
          setErrors({ email: 'Email already in use' });
        } else {
          setErrors({ general: message || 'Registration failed' });
        }
      } else {
        setErrors({ general: 'Network error. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-container-3">
      <div id="part-1">
        <h1>my food</h1>
      </div>

      <div id="part-2">
        <h1>Welcome!</h1>
        <h3>
          to <span style={{ color: 'rgb(252, 72, 102)' }}>My Food</span>
        </h3>

        {errors.general && (
          <p className="error" style={{ textAlign: 'center' }}>
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p id="email-error" className="error">
              {errors.email}
            </p>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <p id="password-error" className="error">
              {errors.password}
            </p>
          )}

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div>
            <button
              type="submit"
              className="submit"
              id="sign"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'SIGN UP'}
            </button>
          </div>

          <NavLink to="../myfood/login">Already have an account?</NavLink>
        </form>
      </div>
    </div>
  );
}

export default Register;
