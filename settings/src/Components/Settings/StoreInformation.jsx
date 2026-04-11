import './storeinformation.css'
import Topbar from '../../Topbar'
import Sidebar from '../Sidebar'
import back from '../Assets/back.png'
import logo from '../Assets/logo.png'
import facebook from '../Assets/facebook.png'
import client1 from '../Assets/client1.jpg'
import { useNavigate } from "react-router-dom";

const StoreInformation = () => {

  const navigate = useNavigate();


  return (
    <div className='storeinfo-con'>
      <Sidebar />
      <div className='store-information'>
        <Topbar />
        <div className='storeinfo-content'>
          <div className='settings-sidebar'>
            <div className='settings-header'>
              <button><img src={back} className='back' alt='back' onClick={() => navigate("/dashboard")}></img></button>
              <p>Settings</p>
            </div>
            <div className='settings-nav'>
              <ul>
                <li className='info'>Store Information</li>
                <li onClick={() => navigate("/logreports")}>Log Reports</li>
                <li onClick={() => navigate("/Systempreferences")}>System Preferences</li>
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
                  <img src={logo} alt='logo'></img>
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
                <img src={client1} alt='owner'></img>
                <h4>Shane Anne C. Gapas</h4>
                <p>Owner</p>
              </div>

              <div className='contacts'>
                <h3>Contact Us</h3>
                <div className='contact-details'>
                  <div className='details'>
                    <div className='facebook'>
                      <img src={facebook} alt='facebook'></img>
                      <p>Love, Athalia Essentials</p>
                    </div>
                    <p>Phase 4 Barangay 176, Caloocan, Philippines, 1428</p>
                    <p>0956 934 5958</p>

                  </div>
                  <div className='map'>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15431.76033268941!2d121.0222938!3d14.772405!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397af0008e7974b%3A0x6e90587c0725755b!2sPhase%204%20Package%201!5e0!3m2!1sen!2sph!4v1775602867208!5m2!1sen!2sph" width="500" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Map"></iframe>
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
