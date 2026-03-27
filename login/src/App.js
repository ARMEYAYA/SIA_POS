import Forgot from './Components/POS/Forgot'
import Login from './Components/POS/Login'
import Verify from './Components/POS/Verify'
import Confirm from './Components/POS/Confirm'
import Change from './Components/POS/Change'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/Confirm" element={<Confirm />} />
        <Route path="/Change" element={<Change />} />
      </Routes>
    </Router>
  );
}

export default App;