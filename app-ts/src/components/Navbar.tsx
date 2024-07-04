import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: 'https://github.com/jayyu23/tsalon-story' },
];

const logoUrl = "/assets/logo_circle.png";

const TopNavbar: React.FC = () => {
  const { isConnected } = useAccount();

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
      <ConnectButton />
    </nav>
  );
};

export default TopNavbar;