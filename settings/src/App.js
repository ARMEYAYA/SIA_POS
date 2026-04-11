import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import StoreInformation from './Components/Settings/StoreInformation'
import Logreports from './Components/Settings/Logreports'
import SystemPreferences from './Components/Settings/SystemPreferences'

const App = () => {
  return (
    <div>
      <Router>
      <Routes>
        <Route path="/StoreInformation" element={<StoreInformation />} />
        <Route path="/Logreports" element={<Logreports/>} />
        <Route path="/SystemPreferences" element={<SystemPreferences/>} />
      </Routes>
    </Router>
    </div>
  )
}

export default App

