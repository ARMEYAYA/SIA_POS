import React from 'react';
import './Forgot.css'
import bg from '../Assets/bg.png'
import rec from '../Assets/rec.png'
import logo from '../Assets/logo.png'
import LOGIN from '../Assets/LOGIN.png'
import { useNavigate } from "react-router-dom"; 

const Forgot = () => {
    const navigate = useNavigate();

    return (
        <div className='forgot-main' style={{ backgroundImage: `url(${LOGIN})` }}>
            <div className='forgot-container'>
                <div className='forgot-header'>
                    <img src={logo}></img>
                    <h2>FORGOT PASSWORD</h2>
                    <p>Please write your email to receive confirmation code</p>
                </div>

                <div className='forgot-form'>
                    <input type='text' className='forgot-email' placeholder='Enter Email'></input>
                </div>
                <button type='submit' className='forgot-submit' onClick={() => navigate("/Verify")}>Confirm Email</button>
            </div>
        </div>
    );
};

export default Forgot;