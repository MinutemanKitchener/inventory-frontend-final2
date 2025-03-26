import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://your-backend-url.onrender.com"; // replace with your backend URL

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid inventory format");
      setInventory(data);
    } catch (err) {
      setError("Load failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System</p>
      </header>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading inventory...</p>}

      {inventory.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(inventory[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;