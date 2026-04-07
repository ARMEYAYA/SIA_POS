import Sidebar from '../Sidebar'
import Topbar from '../../Topbar'
import React, { useState, useEffect } from "react"
import notifications from '../Assets/notifications.png'
import settings from '../Assets/settings.png'
import owner from '../Assets/owner.png'
import back from '../Assets/back.png'
import './Logreports.css'
import filter from '../Assets/filter.png'
import { useNavigate } from "react-router-dom"

const Logreports = () => {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [users] = useState([
    { name: "Ella Matriz", email: "ellamatriz@gmail.com", access: "Admin", lastActive: "2026-04-05", timeIn: "08:00 AM", timeOut: "05:00 PM" },
    { name: "Rowena Sarzosa", email: "sarzosa@gmail.com", access: "Cashier", lastActive: "2026-04-06", timeIn: "10:00 AM", timeOut: "08:00 PM" },
    { name: "Cristel Guerrero", email: "guerrero@gmail.com", access: "Cashier", lastActive: "2026-04-06", timeIn: "10:00 AM", timeOut: "08:00 PM" },
  ])
  const [filteredUsers, setFilteredUsers] = useState(users)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  const formattedDate = time.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = users.filter(user =>
      (user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())) &&
      (roleFilter === "" || roleFilter === "All" || user.access.toLowerCase() === roleFilter.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  const handleFilter = (role = roleFilter) => {
    const filtered = users.filter(user =>
      (role === "" || role === "All" || user.access.toLowerCase() === role.toLowerCase()) &&
      (searchTerm === "" || user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredUsers(filtered)
  }

  return (
    <div className='lreports-container'>
      <Sidebar />

      {/* Top part */}
      <div className='store-information'>
        <Topbar />

        {/* Page container */}
        <div className='logreports-content'>

          {/* TSettings */}
          <div className='settings-sidebar'>
            <div className='settings-header'>
              <button><img src={back} className='back' /></button>
              <p>Settings</p>
            </div>
            <div className='settings-nav'>
              <ul>
                <li onClick={() => navigate("/storeinfo")}>Store Information</li>
                <li onClick={() => navigate("/usermanagement")}>User Management</li>
                <li className='info'>Log Reports</li>
                <li onClick={() => navigate("/preferences")}>System Preferences</li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className='logreports-container'>
            <div className='logreports-header'>
              <h2>Log reports</h2>
            </div>

            <div className='lreports-table'>
              <div className='lreports-header'>
                <p>All Users</p>
                <div className='lreports-user'>
                  <input
                    type='search'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <div className='filter-container'>
                    <img src={filter} alt="filter" className='filter-icon' />
                    <select
                      className='filter'
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value)
                        handleFilter(e.target.value)
                      }}
                    >
                      <option value="All">All</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Inventory Staff">Inventory Staff</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='reportstable-container'>
                <table>
                  <thead>
                    <tr>
                      <th><input type='checkbox' className='check' />User</th>
                      <th>Access</th>
                      <th>Last Active</th>
                      <th>Time in</th>
                      <th>Time out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td className='loginfo-con'>
                          <input type='checkbox' className='check-user' />
                          <img src={owner} style={{ width: "30px", height: "40px", borderRadius: "50%" }} />
                          <div className='name-email'>{user.name}<br />{user.email}</div>
                        </td>
                        <td>{user.access}</td>
                        <td>{user.lastActive}</td>
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