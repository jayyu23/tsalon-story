import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import auth from '../auth/authhandler';
import { FaSignInAlt } from 'react-icons/fa'; 

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: 'https://github.com/jayyu23/tsalon-story' },
];

const logoUrl = "/assets/logo_circle.png";
const SEPOLIA_CHAIN_ID = 11155111;

const TopNavbar: React.FC = () => {

  // Navbar handles Login and Logout
  const { isConnected, address, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();
  

  React.useEffect(() => {
    if (isConnected && address && chain?.id === SEPOLIA_CHAIN_ID) {
      console.log("Connected to Sepolia Chain");
      auth.requestSession(address);
    } else {
      console.log("Disconnected from Sepolia Chain");
      auth.logout();
    }
  }, [isConnected, address, chain]);

  const handleLogin = async () => {
    if (address) {
      try {
        const nonce = auth.getNonce();
        const message = `Sign this message to log in. Nonce: ${nonce}`;
        const signature = await signMessageAsync({ message });
        // await auth.login(address, signature);
        console.log('Logged in successfully');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

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
      {isConnected && address && (
          <button className="login-icon" onClick={handleLogin}>
          <FaSignInAlt size={24} />
        </button>
        )}
        </div>
    </nav>
  );
};

export default TopNavbar;