import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { getCateringServices } from '../../services/api';
import styles from './DropdownMenu.module.scss';
import clsx from 'clsx';

const DropdownMenu = ({ isMobile, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
    setIsOpen(false);
  };

  const [services, setServices] = useState([]);

  useEffect(() => {
    getCateringServices().then(data => {
      if (data && Array.isArray(data)) {
        setServices(data);
      }
    }).catch(err => console.error("Failed to load catering services in dropdown", err));
  }, []);

  const menuItems = [
    ...services.slice(0, 5).map(srv => ({
      name: srv.name,
      path: srv.path || `/catering`,
      highlight: false
    })),
    { name: "View All Events →", path: "/catering", highlight: false, isViewAll: true },
    { name: "Get a Quote", path: "/catering/quote", highlight: true },
  ];

  return (
    <div 
      className={clsx(styles.dropdownContainer, isMobile && styles.mobile)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        to="/catering" 
        className={clsx(styles.dropdownTrigger, isOpen && styles.active)}
        onClick={handleClick}
      >
        Catering <ChevronDown size={16} className={clsx(styles.icon, isOpen && styles.rotated)} />
      </Link>
      
      <div className={clsx(styles.dropdownMenu, isOpen && styles.show)}>
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className={clsx(styles.menuItem, item.highlight && styles.highlight)}
            onClick={handleItemClick}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
