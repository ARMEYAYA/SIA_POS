import React from 'react'
import './Verify.css'
import bg from '../Assets/bg.png'
import rec from '../Assets/rec.png'
import LOGIN from '../Assets/LOGIN.png'
import logo from '../Assets/logo.png'
import { useNavigate } from "react-router-dom"; 

const Verify = () => {
    const navigate = useNavigate();

    return (
        <div className='verify-main' style={{ backgroundImage: `url(${LOGIN})` }}>
            <div className='verify-container'>
                <div className='verify-header'>
                    <img src={logo}></img>
                    <h2>Forgot Password</h2>
                    <h3>Verify Email Address</h3>
                    <p>Verification Code Sent to ellematriz@gmail.com</p>
                </div>
                <div className='code-form'>
                    <input type='text' className='input-code'></input>
                    <input type='text' className='input-code'></input>
                    <input type='text' className='input-code'></input>
                    <input type='text' className='input-code'></input>
                </div>
                <button type='submit' className='verify-submit' onClick={() => navigate("/Confirm")}>Confirm Email</button>
                <p>0:25 Resend Code</p>
            </div>
            
        </div>
    )
}

export default Verify
