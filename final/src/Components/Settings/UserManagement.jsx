import Sidebar from '../Sidebar'
import React, { useState, useEffect } from "react"
import notifications from '../Assets/notifications.png'
import settings from '../Assets/settings.png'
import owner from '../Assets/owner.png'
import back from '../Assets/back.png'
import './UserManagement.css'
import filter from '../Assets/filter.png'
import add from '../Assets/add.png'
import close from '../Assets/close.png'
import dots from '../Assets/dots.png'
import { useNavigate } from "react-router-dom";
import Topbar from '../../Topbar'

const UserManagement = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const [formData, setFormData] = useState({
    userImage: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "Admin",
    addedDate: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = time.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = {
      image: formData.userImage ? URL.createObjectURL(formData.userImage) : "",
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      access: formData.role,
      dateAdded: formData.addedDate || new Date().toLocaleDateString(),
      lastActive: "Just now",
    };

    setUsers([...users, newUser]);
    setShowForm(false);

    setFormData({
      userImage: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "Admin",
      addedDate: "",
      password: "",
      confirmPassword: "",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterRole === "All" || user.access === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='usermanagement-container'>
      <Sidebar />
      <div className='store-information'>
        <Topbar />

        <div className='usermanagement-content'>
          <div className='settings-sidebar'>
            <div className='settings-header'>
              <button><img src={back} className='back' alt="" /></button>
              <p>Settings</p>
            </div>
            <div className='settings-nav'>
              <ul>
                <li onClick={() => navigate("/storeinfo")}>Store Information</li>
                <li className='info'>User Management</li>
                <li onClick={() => navigate("/logreports")}>Log Reports</li>
                <li onClick={() => navigate("/preferences")}>System Preferences</li>
              </ul>
            </div>
          </div>

            {/* Main Content */}
            <div className='umanagement-container'>
            <div className='umanagement-header'>
              <h2>User Management</h2>
              <p>Manage your team member and their account permission here</p>
            </div>

            <div className='user-table'>
              <div className='user-header'>
                <p>All Users</p>
                <div className='user-end'>
                  <input
                    type='search'
                    placeholder='Search'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className='filter-container'>
                    <img src={filter} alt="filter" className='filter-icon' />
                    <select
                      className='filter'
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Inventory Staff">Inventory Staff</option>
                    </select>
                  </div>
                  <button className='add' onClick={() => setShowForm(true)}>
                    <img src={add} alt="" />Add user
                  </button>
                </div>
              </div>

              <div className='table-container'>
                <table>
                  <thead>
                    <tr>
                      <th><input type='checkbox' className='check' /> User</th>
                      <th>Access</th>
                      <th>Last Active</th>
                      <th>Date Added</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td className='userinfo-con'>
                          <input type='checkbox' className='check-user' />
                          <img
                            src={user.image}
                            alt="user"
                            style={{ width: "30px", height: "40px", borderRadius: "50%" }}
                          />
                          <div className='name-email'>
                            {user.name}
                            <br />
                            <small>{user.email}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`role ${user.access.toLowerCase().replace(/\s+/g, '-')}`}>
                            {user.access}
                          </span>
                        </td>
                        <td>{user.lastActive}</td>
                        <td>{user.dateAdded}</td>
                        <td>
                          <button onClick={() => navigate("/Umaccount")}>
                            <img src={dots} alt="" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <div className='form-header'>
              <h2>Add User</h2>
              <button onClick={() => setShowForm(false)}>
                <img src={close} alt="Close" />
              </button>
            </div>

            <p className='outside-header'>User Information</p>
            <div className='form-content'>
              <h4>User Information</h4>
              <div className="form-grid">
                <div>
                  <p>User Image:</p>
                  <input
                    type="file"
                    name="userImage"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>First Name:</p>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Last Name:</p>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Email Address:</p>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Role:</p>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Inventory Staff">Inventory Staff</option>
                  </select>
                </div>
                <div>
                  <p>Added Date:</p>
                  <input
                    type="date"
                    name="addedDate"
                    value={formData.addedDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Password:</p>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p>Confirm Password:</p>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleSubmit}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement