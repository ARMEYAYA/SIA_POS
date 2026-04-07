import React, { Profiler } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import POS from './POS';
import Transaction from './Transaction';
import Product from './Product';
import './App.css';
import Reports from './Reports';
import Archive from './Archive';
import StoreInformation from './Components/Settings/StoreInformation'
import UserManagement from './Components/Settings/UserManagement'
import Umaccount from './Components/Settings/Umaccount'
import Logreports from './Components/Settings/Logreports'
import SystemPreferences from './Components/Settings/SystemPreferences'

 
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
          <Route path="reports" element={<Reports/>} />
          <Route path="archive" element={<Archive />} />
          <Route path="storeinfo" element={<StoreInformation/>} />
          <Route path="usermanagement" element={<UserManagement/>} />
          <Route path="logreports" element={<Logreports/>} />
          <Route path="umaccount" element={<Umaccount/>} />
          <Route path="preferences" element={<SystemPreferences/>} />
        </Route>
      </Routes>
    </Router>
  );
}
 
export default App;
 