import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loanForm, setLoanForm] = useState({ item_id: '', quantity: '', to_location: '' });
  const [returnForm, setReturnForm] = useState({ item_id: '', quantity: '', from_location: '' });
  const [newItemForm, setNewItemForm] = useState({ item: '', quantity: '', reserved: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const API_BASE = "https://inventory-system-2-rhm0.onrender.com";

  const fetchInventory = () => {
    fetch(`${API_BASE}/inventory`)
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(() => setError('Failed to load inventory'));
  };

  const fetchAuditLog = () => {
    fetch(`${API_BASE}/audit-log`)
      .then(res => res.json())
      .then(data => setAuditLog(data))
      .catch(() => setError('Failed to load audit log'));
  };

  useEffect(() => {
    fetchInventory();
    fetchAuditLog();
  }, []);

  const handleLoanSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/loan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...loanForm, quantity: Number(loanForm.quantity) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.detail) throw new Error(data.detail);
        setMessage('Loan successful');
        setLoanForm({ item_id: '', quantity: '', to_location: '' });
        fetchInventory();
        fetchAuditLog();
      })
      .catch(err => setError(err.message));
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...returnForm, quantity: Number(returnForm.quantity) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.detail) throw new Error(data.detail);
        setMessage('Return successful');
        setReturnForm({ item_id: '', quantity: '', from_location: '' });
        fetchInventory();
        fetchAuditLog();
      })
      .catch(err => setError(err.message));
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItemForm, quantity: Number(newItemForm.quantity), reserved: Number(newItemForm.reserved || 0) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.detail) throw new Error(data.detail);
        setMessage('Item added');
        setNewItemForm({ item: '', quantity: '', reserved: '' });
        fetchInventory();
        fetchAuditLog();
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://via.placeholder.com/40" alt="Logo" className="logo" />
        <div className="title-container">
          <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
          <p>Inventory Management System</p>
        </div>
      </header>

      <nav className="navbar">
        <button>Dashboard</button>
        <button>Inventory</button>
        <button>Loan/Return</button>
        <button>Audit Log</button>
      </nav>

      <main className="main-content">
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <section className="inventory-table">
          <h2>Inventory Table</h2>
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
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reserved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="loan-return">
          <h2>Loan Items</h2>
          <form onSubmit={handleLoanSubmit}>
            <input type="number" placeholder="Item ID" value={loanForm.item_id} onChange={(e) => setLoanForm({ ...loanForm, item_id: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={loanForm.quantity} onChange={(e) => setLoanForm({ ...loanForm, quantity: e.target.value })} required />
            <input type="text" placeholder="To Location" value={loanForm.to_location} onChange={(e) => setLoanForm({ ...loanForm, to_location: e.target.value })} required />
            <button type="submit">Submit Loan</button>
          </form>

          <h2>Return Items</h2>
          <form onSubmit={handleReturnSubmit}>
            <input type="number" placeholder="Item ID" value={returnForm.item_id} onChange={(e) => setReturnForm({ ...returnForm, item_id: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={returnForm.quantity} onChange={(e) => setReturnForm({ ...returnForm, quantity: e.target.value })} required />
            <input type="text" placeholder="From Location" value={returnForm.from_location} onChange={(e) => setReturnForm({ ...returnForm, from_location: e.target.value })} required />
            <button type="submit">Submit Return</button>
          </form>
        </section>

        <section className="add-inventory">
          <h2>Add New Inventory Item</h2>
          <form onSubmit={handleAddItemSubmit}>
            <input type="text" placeholder="Item Name" value={newItemForm.item} onChange={(e) => setNewItemForm({ ...newItemForm, item: e.target.value })} required />
            <input type="number" placeholder="Quantity" value={newItemForm.quantity} onChange={(e) => setNewItemForm({ ...newItemForm, quantity: e.target.value })} required />
            <input type="number" placeholder="Reserved" value={newItemForm.reserved} onChange={(e) => setNewItemForm({ ...newItemForm, reserved: e.target.value })} />
            <button type="submit">Add Item</button>
          </form>
        </section>

        <section className="audit-log">
          <h2>Audit Log</h2>
          <ul>
            {auditLog.map((log, index) => (
              <li key={index}>
                [{log.timestamp}] {log.action.toUpperCase()} — {log.quantity} of "{log.item}" {log.action === 'loan' ? `to ${log.to}` : log.action === 'return' ? `from ${log.from}` : ''}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;