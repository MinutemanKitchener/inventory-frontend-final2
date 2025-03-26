import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://inventory-system-3.onrender.com";

  const columns = [
    "date_of_purchase", "vendor", "vendor_invoice", "price_per_m",
    "product_type", "brand", "paper_finish", "paper_weight",
    "colour", "size", "quantity_on_hand", "reserved_customer",
    "reserved_job", "quantity_available", "loaned_to",
    "borrowed_from", "notes"
  ];

  const productTypeOptions = [
    "Text", "Cover", "Label Stock", "Synthetic", "Envelopes", "Tags",
    "Roll Label Stock", "Wide Format Adhesive Back Vinyl", "Foamcore",
    "Coroplast", "PVC", "Alu Panel", "Laminate"
  ];

  const paperFinishOptions = [
    "Uncoated", "Semi Gloss", "Gloss", "High Gloss",
    "Silk", "Matte", "Lustre"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({});
        fetchInventory();
      } else {
        setError(result.error || "Submission failed.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System</p>
      </header>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <h2>Add Inventory Item</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {columns.map((key) => {
            if (key === "product_type") {
              return (
                <select key={key} name={key} value={formData[key] || ""} onChange={handleChange}>
                  <option value="">Select product type</option>
                  {productTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              );
            }
            if (key === "paper_finish") {
              return (
                <select key={key} name={key} value={formData[key] || ""} onChange={handleChange}>
                  <option value="">Select paper finish</option>
                  {paperFinishOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={key}
                name={key}
                placeholder={key}
                value={formData[key] || ""}
                onChange={handleChange}
                style={{ flex: '1 1 200px', padding: '5px' }}
              />
            );
          })}
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Add Item</button>
      </form>

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