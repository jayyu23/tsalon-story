import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import auth from '../auth/authhandler';
// import { FaSignInAlt } from 'react-icons/fa'; 

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: 'https://github.com/jayyu23/tsalon-story' },
];

const logoUrl = "/assets/logo_circle.png";
const SEPOLIA_CHAIN_ID = 11155111;

const TopNavbar: React.FC = () => {

  // Navbar handles Login and Logout
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  

  React.useEffect(() => {
      console.log(auth.accountAddress, address)
      if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
        console.log("Connected to Sepolia Chain");
          if (auth.accountAddress !== address) {
            auth.login(address, signMessageAsync).then(() => {
              console.log("Login successful");
            }).catch((error) => {
              console.log("Login failed:", error);
              disconnect();
              auth.logout();
            }
            );
          }
      } else {
        console.log("Disconnected from Sepolia Chain");
        disconnect();
        auth.logout();
      }
  }, [isConnected, address, chain]);

  return (
    <nav className="navbar">
      <div className="nav-items">
      <img
            className="navbar-brand m-x-2 d-inline-block align-top"
            src={logoUrl}
            width="45px"
          ></img>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className="nav-item">
            {item.name}
          </Link>
        ))}
        {isConnected && (
          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>
        )}
      </div>
      <div className="connectDetails">
      <ConnectButton />
      {isConnected && address && ( false
        //   <button className="login-icon" onClick={handleLogin}>
      
        //   <FaSignInAlt size={24} />
        // </button>
        )}
        </div>
    </nav>
  );
};

export default TopNavbar;