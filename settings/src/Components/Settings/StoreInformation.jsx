import './storeinformation.css'
import Sidebar from '../Sidebar'
import React, { useState, useEffect } from "react"
import notifications from '../Assets/notifications.png'
import settings from '../Assets/settings.png'
import owner from '../Assets/owner.png'
import back from '../Assets/back.png'
import logo from '../Assets/logo.png'
import team from '../Assets/team.png'
import facebook from '../Assets/facebook.png'
import map from '../Assets/map.png'
import { useNavigate } from "react-router-dom";

const StoreInformation = () => {

  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // cleanup
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
    <div className='storeinfo-con'>
      <Sidebar />
      <div className='store-information'>
        <div className='top-nav'>
          <div className='date-time'>
            <p>{formattedTime}</p>
            <p>{formattedDate}</p>
          </div>

          <div className='top-icon'>
            <button><img src={notifications}></img></button>
            <button><img src={settings}></img></button>
          </div>

          <button className='owner-icon'><img src={owner}></img></button>
        </div>

        <div className='storeinfo-content'>
          <div className='settings-sidebar'>
            <div className='settings-header'>
              <button><img src={back} className='back'></img></button>
              <p>Settings</p>
            </div>
            <div className='settings-nav'>
              <ul>
                <li className='info'>Store Information</li>
                <li onClick={() => navigate("/UserManagement")}>User Management</li>
                <li onClick={() => navigate("/Logreports")}>Log Reports</li>
                <li onClick={() => navigate("/SystemPreferences")}>System Preferences</li>
              </ul>
            </div>
          </div>
          <div className='storeinfo-main'>
            <div className='store-title'>
              <h2>Store Information</h2>
            </div>
            <div className='storemain-content'>
              <div className='store-description'>
                <div className='storedescription-logo'>
                  <img src={logo}></img>
                </div>
                <div className='description'>
                  <h3>Caloocan-based kidswear store since <b>2022</b></h3>
                  <h1>LOVE ATHALIA ESSENTIALS</h1>
                  <p>We are a Caloocan‑based kidswear store, proudly serving families since
                    2022. Offering both wholesale and retail options, we provide stylish
                    and affordable clothing for children of all ages. Shop with us for quality
                    apparel that blends comfort and charm.</p>
                </div>
              </div>

              <div className='team'>
                <h3>Meet the Team</h3>
                <img src={team}></img>
                <h4>Shane Anne C. Gapas</h4>
                <p>Owner</p>
              </div>

              <div className='contacts'>
                <h3>Contact Us</h3>
                <div className='contact-details'>
                  <div className='details'>
                    <div className='facebook'>
                      <img src={facebook}></img>
                      <p>Love, Athalia Essentials</p>
                    </div>
                    <p>Phase 4 Barangay 176, Caloocan, Philippines, 1428</p>
                    <p>0956 934 5958</p>

                  </div>
                  <div className='map'>
                    <img src={map}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StoreInformation
