import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ location: 'Kitchener' });
  const [activeTab, setActiveTab] = useState('Kitchener');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://inventory-system-3.onrender.com";

  const columns = [
    "date_of_purchase", "vendor", "vendor_invoice", "price_per_m",
    "product_type", "brand", "paper_finish", "paper_weight",
    "colour", "size", "quantity_on_hand", "reserved_customer",
    "reserved_job", "quantity_available", "loaned_to",
    "borrowed_from", "notes", "location"
  ];

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

      <table>
        <thead>
          <tr>
            {columns.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <tr key={index}>
                {columns.map((col, i) => (
                  <td key={i}>{item[col] || ""}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No inventory records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;