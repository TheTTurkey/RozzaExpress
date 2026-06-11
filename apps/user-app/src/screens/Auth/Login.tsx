import React, { useState } from 'react';
import { validateRosminiSignIn } from '../../auth/authService';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (user: { id: string; name: string; email: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const validatedUser = validateRosminiSignIn(email, name || 'Josh Tuilagi');
      onLoginSuccess(validatedUser);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-blob login-bg-blob--1" />
      <div className="login-bg-blob login-bg-blob--2" />

      <div className="login-card">
        <div className="login-logo-container">
          <span className="login-logo-icon">🍕</span>
        </div>
        
        <h1 className="login-title">
          Rozza <span className="login-title-highlight">Express</span>
        </h1>
        <p className="login-subtitle">Rosmini College Tuck Shop Student Sign-in</p>

        {error && (
          <div className="login-error-alert" id="login-error-message">
            <svg viewBox="0 0 24 24" className="error-icon" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="student-name">Full Name</label>
            <input
              type="text"
              id="student-name"
              placeholder="e.g., Josh Tuilagi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="student-email">Rosmini Student Email</label>
            <input
              type="text"
              id="student-email"
              placeholder="e.g., 22235@rosmini.school.nz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small className="input-hint">Must begin with your student number and end with @rosmini.school.nz</small>
          </div>

          <button type="submit" className="login-submit-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
