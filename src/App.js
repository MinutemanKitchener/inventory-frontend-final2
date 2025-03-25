import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <img src="https://via.placeholder.com/40" alt="Logo" className="logo" />
        <div className="title-container">
          <h1>MINUTEMAN PRESS KITCHENER / CAMBRIDGE</h1>
          <p>Inventory Management System</p>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="navbar">
        <button>Dashboard</button>
        <button>Inventory</button>
        <button>Loan/Return</button>
        <button>Audit Log</button>
      </nav>

      {/* Main Content Layout */}
      <main className="main-content">
        <section className="dashboard">
          <h2>Dashboard</h2>
          <p>Summary view with key metrics (coming soon).</p>
        </section>

        <section className="inventory-table">
          <h2>Inventory Table</h2>
          <p>Here is where your inventory will be listed and managed.</p>
        </section>

        <section className="loan-return">
          <h2>Loan / Return</h2>
          <p>Loan and return inventory between locations here.</p>
        </section>

        <section className="audit-log">
          <h2>Audit Log</h2>
          <p>Track all activity and changes in this section.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
