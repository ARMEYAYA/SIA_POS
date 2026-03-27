import React from 'react'
import './Confirm.css'
import bg from '../Assets/bg.png'
import rec from '../Assets/rec.png'
import logo from '../Assets/logo.png'
import LOGIN from '../Assets/LOGIN.png'
import visibility from '../Assets/visibility.png'
import { useNavigate } from "react-router-dom"; 



const Confirm = () => {
  const navigate = useNavigate();
  return (
    <div className='Confirm-main' style={{ backgroundImage: `url(${LOGIN})` }}>
      <div className='confirm-container'>
        <div className='confirm-header'>
            <img src={logo}></img>
            <h2>New Password</h2>
            <p>Please set your new password</p>
        </div>
        <div className='confirm-form'>
            <div className='password-form'>
            <input type='password' className='confirm-password' placeholder='Enter New Password'></input>
            <button type='button' className='visible-button'><img src={visibility}></img></button>
            </div>
            
            <div className='password-form'>
            <input type='password' className='confirm-password' placeholder='Confirm New Password'></input>
            <button type='button' className='visible-button'><img src={visibility}></img></button>
            </div>
            
        </div>
        <button type='submit' className='confirm-submit' onClick={() => navigate("/Change")}>Reset Password</button>
      </div>
    </div>
  )
}

export default Confirm
