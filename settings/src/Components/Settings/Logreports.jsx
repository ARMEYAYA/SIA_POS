import Topbar from '../../Topbar'
import Sidebar from '../Sidebar'
import React, { useState } from "react"
import owner from '../Assets/owner.png'
import back from '../Assets/back.png'
import './Logreports.css'
import latest from '../Assets/latest.png'
import oldest from '../Assets/oldest.png'
import { useNavigate } from "react-router-dom"

const Logreports = () => {
  const navigate = useNavigate()
  const [users] = useState([
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-05", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-06", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-07", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-08", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-06", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", lastActive: "2026-04-07", timeIn: "08:00 AM", timeOut: "05:00 PM" }
  ])

  const [isLatest, setIsLatest] = useState(true);
    const sortedUsers = [...users].sort((a, b) =>
    isLatest
      ? new Date(b.lastActive) - new Date(a.lastActive) 
      : new Date(a.lastActive) - new Date(b.lastActive) 
  );


  return (
    <div className='lreports-container'>
      <Sidebar />
      <div className='store-information'>
        <Topbar />

        <div className='logreports-content'>
          <div className='settings-sidebar'>
            <div className='settings-header'>
              <button><img src={back} className='back' alt='back' onClick={() => navigate("/dashboard")} /></button>
              <p>Settings</p>
            </div>
            <div className='settings-nav'>
              <ul>
                <li onClick={() => navigate("/storeinformation")}>Store Information</li>
                <li className='info'>Log Reports</li>
                <li onClick={() => navigate("/Systempreferences")}>System Preferences</li>
              </ul>
            </div>
          </div>

          <div className='logreports-container'>
            <div className='logreports-header'>
              <h2>Log reports</h2>
            </div>

            <div className='lreports-table'>
              <div className='lreports-header'>
                <button className='active-filter' onClick={() => setIsLatest(!isLatest)}><img src={isLatest ? latest : oldest} alt="filter"></img></button>
              </div>

              <div className='reportstable-container'>
                <table>
                  <thead>
                    <tr>
                      <th><input type='checkbox' className='check' />User</th>
                      <th>Last Active</th>
                      <th>Time in</th>
                      <th>Time out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user, index) => (
                      <tr key={index}>
                        <td className="loginfo-con">
                          <input type="checkbox" className="check-user" />
                          <img
                            src={owner}
                            style={{ width: "30px", height: "40px", borderRadius: "50%" }}
                            alt="owner"
                          />
                          <div className="name-email">
                            {user.name}
                            <br />
                            {user.email}
                          </div>
                        </td>
                        <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                        <td>{user.timeIn}</td>
                        <td>{user.timeOut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Logreports