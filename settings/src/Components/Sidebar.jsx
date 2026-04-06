import React, { useState } from 'react'
import './sidebar.css'
import pos from './Assets/pos.png'
import logo from './Assets/logo.png'
import product from './Assets/product.png'
import reports from './Assets/reports.png'
import transaction from './Assets/transaction.png'
import dsh from './Assets/dsh.png'
import exit from './Assets/exit.png'

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`nav-bar ${open ? 'active' : ''}`}>
        <div className='nav-logo'>
          <img src={logo} alt="logo" />
        </div>

        <div className='nav-list'>
          <ul>
            <li className='nav-item-dashboard'>
              <img src={dsh} alt='dashboard' className='nav-icon' />
              <span>Dashboard</span>
            </li>
            <li className='nav-item'>
              <img src={pos} alt="pos" className='nav-icon' />
              <span>POS</span>
            </li>
            <li className='nav-item'>
              <img src={transaction} alt="transaction" className='nav-icon' />
              <span>Transaction</span>
            </li>
            <li className='nav-item'>
              <img src={product} alt="product" className='nav-icon' />
              <span>Product</span>
            </li>
            <li className='nav-item'>
              <img src={reports} alt="reports" className='nav-icon' />
              <span>Reports</span>
            </li>
          </ul>
        </div>

        <div className='logout-con'>
          <div className='logout'>
            <img src={exit} alt="logout" />
            <span>LOG OUT</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
