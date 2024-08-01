import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import WalletFunction from './WalletFunction'; // Import the new WalletFunction component
import auth from '../auth/authhandler';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: 'https://github.com/jayyu23/tsalon-story' },
  { name: 'Dashboard', path: '/dashboard', protected: true },
];

const logoUrl = "/assets/logo_circle.png";

const TopNavbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-items">
        <img
          className="navbar-brand m-x-2 d-inline-block align-top"
          src={logoUrl}
          width="45px"
          alt="Logo"
        ></img>
        {navItems.map((item) => (
          <Link key={item.name} to={item.path} className="nav-item">
            {
              (!item.protected || auth.isLoggedIn()) ? item.name : ""
  }
          </Link>
        ))}
      </div>
      <WalletFunction />
    </nav>
  );
};

export default TopNavbar;