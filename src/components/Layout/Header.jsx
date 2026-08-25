import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import styles from './Header.module.scss';
import Button from '../UI/Button';
import DropdownMenu from './DropdownMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSettingsStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <p>
          {settings 
            ? `RESERVATIONS: ${settings.phone_reservations} | CATERING: ${settings.phone_catering}`
            : 'RESERVATIONS: +91 90000 12345 | CATERING: +91 90000 54321'}
        </p>
      </div>
      <div className={`container ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          {settings?.name || 'SV Caterers Sri Varsha'}
        </Link>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
          <DropdownMenu isMobile={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/catering/quote" className={styles.desktopOnly}>
            <Button size="small">Get Quote</Button>
          </Link>
          <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
