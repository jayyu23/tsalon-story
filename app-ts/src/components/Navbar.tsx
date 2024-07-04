import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

const TopNavbar: React.FC = () => {
  return (
    <nav className="navbar">
        <div className="nav-items">
            {navItems.map((item) => (
            <Link key={item.name} to={item.path} className="nav-item text-white">
                {item.name}
            </Link>
            ))}
      </div>
      <ConnectButton />
    </nav>
  );
};

export default TopNavbar;