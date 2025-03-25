import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [inventory, setInventory] = useState([]);
  const [itemForm, setItemForm] = useState({ item: '', quantity: '', reserved: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://inventory-system-2-rhm0.onrender.com";

  useEffect(() => {
    if (token) {
      fetchInventory();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const text = await res.text();
      console.log("Raw login response:", text);
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.detail || "Login failed");
      setToken(data.token);
      setUser(email);
      setLocation(data.location);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: " + err.message);
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const text = await res.text();
      console.log("Raw inventory response:", text);
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("Invalid inventory format");
      setInventory(data);
    } catch (err) {
      console.error("Inventory fetch failed:", err);
      setError("Load failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: itemForm.item,
          quantity: Number(itemForm.quantity),
          reserved: Number(itemForm.reserved || 0)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Add failed");
      setMessage("Item added");
      setItemForm({ item: '', quantity: '', reserved: '' });
      fetchInventory();
    } catch (err) {
      setError("Add item failed: " + err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
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
              <input type="number" placeholder="Quantity" value={itemForm.quantity} onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} required />
              <input type="number" placeholder="Reserved" value={itemForm.reserved} onChange={(e) => setItemForm({ ...itemForm, reserved: e.target.value })} />
              <button type="submit">Add Item</button>
            </form>
          </section>

          <section className="inventory-list">
            <h2>Inventory</h2>
            {loading ? (
              <p>Loading inventory...</p>
            ) : (
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
                      <td>{item.quantity}</td>
                      <td>{item.reserved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default App;