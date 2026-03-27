import React from 'react';
import './Login.css';
import bg from '../Assets/bg.png';
import rec from '../Assets/rec.png';
import logo from '../Assets/logo.png';
import LOGIN from '../Assets/LOGIN.png'
import visibility from '../Assets/visibility.png'
import { useNavigate } from "react-router-dom"

const Login = () => {
  const navigate = useNavigate(); 

  return (
    <div className='login-main' style={{ backgroundImage: `url(${LOGIN})` }}>
      <div className='login-container'>
        <div className='login-header'>
          <img src={logo} className='logo' alt="Logo" />
          <h2>Log in to your Account</h2>
          <p>Welcome back Admin! Enter your details to log in to your account</p>
          <div className='login-form'>
            <input type='text' placeholder='Enter username' className='input-user' />
            <div className='password-wrapper'>
              <div className='forgot'>
                <p onClick={() => navigate("/Forgot") } >
                  Forgot Password?
                </p>
              </div>
              <div className='password-container'>
              <input type='password' placeholder='Enter password' className='input-password' />
              <img src={visibility}></img>
              </div>
            </div>
          </div>
          <button type='submit' className='login-submit'>Login to your Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;