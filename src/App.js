import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState('');

  const API_BASE = "https://inventory-system-2-rhm0.onrender.com";

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const text = await res.text();
      setRawData(text);
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("Expected array of inventory items.");
      setInventory(data);
    } catch (err) {
      setError("Load failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldOrder = [
    "id",
    "date_of_purchase",
    "vendor",
    "vendor_invoice",
    "price_per_m",
    "product_type",
    "brand",
    "paper_finish",
    "paper_weight",
    "colour",
    "size",
    "quantity_on_hand",
    "reserved_customer",
    "reserved_job",
    "quantity_available",
    "loaned_to",
    "borrowed_from",
    "notes"
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
        <p>Inventory Management System (All Fields)</p>
      </header>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading inventory...</p>}

      {!error && inventory.length > 0 ? (
        <section className="inventory-list">
          <table>
            <thead>
              <tr>
                {fieldOrder.map((field) => (
                  <th key={field}>{field.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={index}>
                  {fieldOrder.map((field) => (
                    <td key={field}>{item[field] ?? ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {error && rawData && (
        <section className="raw-output">
          <h3>Raw Inventory Data:</h3>
          <pre>{rawData}</pre>
        </section>
      )}
    </div>
  );
}

export default App;