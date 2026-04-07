import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import StoreInformation from './Components/Settings/StoreInformation'
import UserManagement from './Components/Settings/UserManagement'
import Umaccount from './Components/Settings/Umaccount'
import Logreports from './Components/Settings/Logreports'
import SystemPreferences from './Components/Settings/SystemPreferences'

const App = () => {
  return (
    <div>
      <Router>
      <Routes>
        <Route path="/StoreInformation" element={<StoreInformation />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/Umaccount" element={<Umaccount />} />
        <Route path="/Logreports" element={<Logreports/>} />
        <Route path="/SystemPreferences" element={<SystemPreferences/>} />
      </Routes>
    </Router>
    </div>
  )
}

export default App

