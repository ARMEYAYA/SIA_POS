import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import POS from './POS';
import Transaction from './Transaction';
import Product from './Product';
import Reports from './Reports';
import Archive from './Archive';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="product" element={<Product />} />
          <Route path="reports" element={<Reports />} />
          <Route path="archive" element={<Archive />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;