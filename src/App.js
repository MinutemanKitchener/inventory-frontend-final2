import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [inventory, setInventory] = useState([]);
  const [itemForm, setItemForm] = useState({ item: '', quantity_on_hand: '', reserved: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE = "https://inventory-system-2-rhm0.onrender.com";

  useEffect(() => {
    if (token) {
      fetchInventory();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }
      setToken(data.token);
      setUser(email);
      setLocation(data.location);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      setError("Failed to load inventory");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: itemForm.item,
          quantity_on_hand: Number(itemForm.quantity_on_hand),
          reserved: Number(itemForm.reserved || 0)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Add failed");
      setMessage("Item added");
      setItemForm({ item: '', quantity_on_hand: '', reserved: '' });
      fetchInventory();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setLocation('');
    setInventory([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System</p>
      </header>

      {!token ? (
        <section className="login-section">
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>
      ) : (
        <>
          <nav className="navbar">
            <p>Logged in as: {user} ({location})</p>
            <button onClick={handleLogout}>Logout</button>
          </nav>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <section className="add-inventory">
            <h2>Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <input type="text" placeholder="Item" value={itemForm.item} onChange={(e) => setItemForm({ ...itemForm, item: e.target.value })} required />
              <input type="number" placeholder="Quantity on Hand" value={itemForm.quantity_on_hand} onChange={(e) => setItemForm({ ...itemForm, quantity_on_hand: e.target.value })} required />
              <input type="number" placeholder="Reserved" value={itemForm.reserved} onChange={(e) => setItemForm({ ...itemForm, reserved: e.target.value })} />
              <button type="submit">Add Item</button>
            </form>
          </section>

          <section className="inventory-list">
            <h2>Inventory</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Reserved</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.item}</td>
                    <td>{item.quantity_on_hand}</td>
                    <td>{item.quantity_reserved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

export default App;