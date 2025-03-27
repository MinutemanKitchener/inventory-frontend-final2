import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ location: 'Kitchener' });
  const [activeTab, setActiveTab] = useState('Kitchener');
  const [error, setError] = useState('');
  const [debugMessage, setDebugMessage] = useState('');
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
    setDebugMessage('');
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Load failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDebugMessage('');
    try {
      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '') delete cleanedData[key];
      });

      const res = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const result = await res.json();
      if (res.ok) {
        setDebugMessage("Submitted successfully: " + JSON.stringify(result));
        setFormData({ location: activeTab });
        fetchInventory();
      } else {
        setError("Submission failed: " + JSON.stringify(result));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const filteredInventory = inventory.filter(item => item.location === activeTab);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        {["Kitchener", "Cambridge"].map(loc => (
          <button
            key={loc}
            onClick={() => {
              setActiveTab(loc);
              setFormData(prev => ({ ...prev, location: loc }));
            }}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              fontWeight: activeTab === loc ? 'bold' : 'normal',
              background: activeTab === loc ? '#007bff' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {loc}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h2>Add Inventory Item</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
          marginBottom: '10px'
        }}>
          {columns.map((key) => (
            <div key={key}>
              <label><strong>{key}</strong></label>
              <input
                type={key === "date_of_purchase" ? "date" : "text"}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                placeholder={key}
              />
            </div>
          ))}
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Add Item</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {debugMessage && <p style={{ color: 'blue' }}>{debugMessage}</p>}
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
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item, index) => (
              <tr key={index}>
                {columns.map((col, i) => (
                  <td key={i}>{item[col] || ""}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No inventory records found for {activeTab}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;