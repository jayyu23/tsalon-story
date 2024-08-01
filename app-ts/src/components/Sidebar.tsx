import React, { useState } from 'react';
import { FaHome, FaTachometerAlt, FaFolderOpen, FaDraftingCompass, FaCheck, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './sidebar.css';

interface SidebarItem {
  name: string;
  icon: JSX.Element;
}

const items: SidebarItem[] = [
  { name: 'Explore', icon: <FaHome /> },
  { name: 'Dashboard', icon: <FaTachometerAlt /> },
  { name: 'Collections', icon: <FaFolderOpen /> },
  { name: 'Drafts', icon: <FaDraftingCompass /> },
  { name: 'Review', icon: <FaCheck /> },
  { name: 'Settings', icon: <FaCog /> },
];

interface SidebarProps {
  initialActiveItem: string;
}

const Sidebar: React.FC<SidebarProps> = ({ initialActiveItem }) => {
  const [activeItem, setActiveItem] = useState<string>(initialActiveItem);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleItemClick = (name: string) => {
    setActiveItem(name);
    // Assuming this would trigger a page navigation, e.g., via React Router.
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
      <ul>
        {items.map((item, index) => (
          <li key={index} className={item.name === activeItem ? 'active' : ''}>
            <a href="#" onClick={() => handleItemClick(item.name)}>
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;