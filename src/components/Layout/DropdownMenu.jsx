import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { getCateringServices } from '../../services/api';
import styles from './DropdownMenu.module.scss';
import clsx from 'clsx';

const DropdownMenu = ({ isMobile, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getCateringServices()
      .then((data) => {
        if (isMounted && data && Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error('Failed to load catering dropdown:', err));

    return () => {
      isMounted = false;
    };
  }, []);

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
        <span>Catering</span>
        <ChevronDown size={15} className={clsx(styles.chevron, isOpen && styles.rotated)} />
      </Link>
      
      <div className={clsx(styles.dropdownMenu, isOpen && styles.show)}>
        <div className={styles.menuHeader}>
          <span>Event Catering Packages</span>
        </div>
        
        <div className={styles.servicesGrid}>
          {services.slice(0, 6).map((srv) => (
            <Link 
              key={srv.id} 
              to={srv.path || `/catering/${srv.id}`} 
              className={styles.menuItem}
              onClick={handleItemClick}
            >
              <span className={styles.srvName}>{srv.name}</span>
              {srv.capacity && <span className={styles.srvCap}>{srv.capacity}</span>}
            </Link>
          ))}
        </div>

        <div className={styles.menuFooter}>
          <Link 
            to="/catering" 
            className={styles.viewAllLink}
            onClick={handleItemClick}
          >
            View All Services →
          </Link>
          <Link 
            to="/catering/quote" 
            className={styles.quoteLink}
            onClick={handleItemClick}
          >
            <Sparkles size={14} /> Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
