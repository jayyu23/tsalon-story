import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import WalletFunction from './WalletFunction'; // Import the new WalletFunction component
import { useAccount } from 'wagmi';
import { useAuth } from '../auth/useAuth';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: 'https://github.com/jayyu23/tsalon-story' },
  { name: 'Dashboard', path: '/dashboard', protected: true },
];

const logoUrl = "/assets/logo_circle.png";

const TopNavbar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { isConnected, isConnecting } = useAccount();

  const visibleNavItems = navItems.filter(item => !item.protected || (isConnected) );

  
  return (
    <nav className="navbar">
      <div className="nav-items">
        <img
          className="navbar-brand m-x-2 d-inline-block align-top"
          src={logoUrl}
          width="45px"
          alt="Logo"
        />
        {visibleNavItems.map((item) => (
          <Link key={item.name} to={item.path} className="nav-item">
            {item.name}
          </Link>
        ))}
      </div>
      <WalletFunction />
    </nav>
  );
};

export default TopNavbar;