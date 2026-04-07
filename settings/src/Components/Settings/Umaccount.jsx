import Sidebar from '../Sidebar'
import React, { useState, useEffect } from "react"
import notifications from '../Assets/notifications.png'
import settings from '../Assets/settings.png'
import owner from '../Assets/owner.png'
import back from '../Assets/back.png'
import './umaccount.css'
import { useNavigate } from "react-router-dom";
import arrow from '../Assets/arrow.png'
import arrowleft from '../Assets/arrowleft.png'

const Umaccount = () => {
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date());
    const [userImage, setUserImage] = useState(owner);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
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

    return (
        <div className='umaccount-container'>
            <Sidebar />
            <div className='store-information'>
                <div className='top-nav'>
                    <div className='date-time'>
                        <p>{formattedTime}</p>
                        <p>{formattedDate}</p>
                    </div>

                    <div className='top-icon'>
                        <button><img src={notifications} /></button>
                        <button><img src={settings} /></button>
                    </div>

                    <img src={owner} className='owner-icon' />
                </div>

                <div className='umaccount-content'>
                    <div className='settings-sidebar'>
                        <div className='settings-header'>
                            <button><img src={back} className='back' /></button>
                            <p>Settings</p>
                        </div>
                        <div className='settings-nav'>
                            <ul>
                                <li onClick={() => navigate("/StoreInformation")} >Store Information</li>
                                <li className='info' onClick={() => navigate("/UserManagement")}>User Management</li>
                                <li onClick={() => navigate("/Logreports")}>Log Reports</li>
                                <li onClick={() => navigate("/Systempreferences")}>System Preferences</li>
                            </ul>
                        </div>
                    </div>

                    <div className='umaccount'>
                        <div className='umaccount-header'>
                            <div className='management'>
                                <button onClick={() => navigate("/UserManagement")}><img src={arrowleft} /></button>
                                <p>User Management</p>
                            </div>
                            <div className='account-settings'>
                                <button><img src={arrow} /></button>
                                <p>Account Settings</p>
                            </div>
                        </div>

                        <div className='umaccount-main'>
                            <div className='user-info'>
                                <div className='user-image'>
                                    {userImage ? (
                                        <img src={userImage} alt="User" />
                                    ) : (
                                        <div className='no-image'>Add Image</div>
                                    )}
                                </div>
                                <div className='info-container'>
                                    <div className='info-button'>
                                        <button className='change' onClick={() => document.getElementById('imageUpload').click()}>
                                            Change Image
                                        </button>
                                        <button className='remove' onClick={() => setUserImage(null)}>
                                            Remove Image
                                        </button>
                                    </div>

                                    <div className='info-name'>
                                        <div className='first'>
                                            <h4>First Name</h4>
                                            <p></p>
                                        </div>
                                        <div className='last'>
                                            <h4>Last Name</h4>
                                            <p></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='account-security'>
                                <div className='as-header'>
                                    <p>Account Security</p>
                                </div>

                                <div className='as-content'>
                                    <div className='as-email'>
                                        <p>Email:</p>
                                        <div className='change-email'>
                                            <p></p>
                                            <button>Change email</button>
                                        </div>
                                    </div>

                                    <div className='as-password'>
                                        <p>Password:</p>
                                        <div className='change-password'>
                                            <p></p>
                                            <button>Change password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='support-access'>
                                <div className='sa-header'>
                                    <p>Account Security</p>
                                </div>

                                <div className='sa-content'>
                                    <div className='delete-header'>
                                        <p>Delete Account</p>
                                        <div className='delete-con'>
                                            <p>permanently delete account and remove access from all workspaces.</p>
                                            <button>Delete Account</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const imageURL = URL.createObjectURL(file);
                        setUserImage(imageURL);
                    }
                }}
            />
        </div>
    )
}

export default Umaccount