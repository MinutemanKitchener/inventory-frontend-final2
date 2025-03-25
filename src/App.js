import React, { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState('');
  const [location, setLocation] = useState('');

  const API_BASE = "https://inventory-system-2-rhm0.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(email);
        setToken(data.token);
        setLocation(data.location);
      } else {
        setLoginError(data.detail || 'Login failed');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setLocation('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System</p>
      </header>

      {!user ? (
        <section className="login-section">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </section>
      ) : (
        <>
          <nav className="navbar">
            <p>Logged in as: {user} ({location})</p>
            <button onClick={handleLogout}>Logout</button>
          </nav>

          <main className="main-content">
            <section className="dashboard">
              <h2>Welcome, {location} User</h2>
              <p>Your secure dashboard will appear here next.</p>
            </section>
          </main>
        </>
      )}
    </div>
  );
}

export default App;