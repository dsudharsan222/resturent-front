import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu as MenuIcon, X, ShoppingBag, Phone, Clock, Sparkles } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import useCartStore from '../../store/useCartStore';
import styles from './Header.module.scss';
import Button from '../UI/Button';
import DropdownMenu from './DropdownMenu';
import clsx from 'clsx';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { getItemCount, openCart } = useCartStore();

  const cartCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const restaurantName = settings?.name || 'SV Caterers Sri Varsha';
  const reservationsPhone = settings?.phone_reservations || '+91 90000 12345';
  const cateringPhone = settings?.phone_catering || '+91 90000 54321';

  return (
    <header className={clsx(styles.header, isScrolled && styles.scrolled)}>
      {/* Top Banner */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContainer}`}>
          <div className={styles.topBarLeft}>
            <span className={styles.topBarItem}>
              <Phone size={13} />
              <span>Reservations: <strong>{reservationsPhone}</strong></span>
            </span>
            <span className={styles.divider}>•</span>
            <span className={styles.topBarItem}>
              <Sparkles size={13} />
              <span>Catering: <strong>{cateringPhone}</strong></span>
            </span>
          </div>

          <div className={styles.topBarRight}>
            <span className={styles.topBarItem}>
              <Clock size={13} />
              <span>Timings: {settings?.timings || '9:00 AM - 10:00 PM'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`container ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logoEmblem}>SV</span>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>{restaurantName}</span>
            <span className={styles.logoSub}>Authentic Taste & Grand Catering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
          >
            Menu
          </NavLink>
          <DropdownMenu />
          <NavLink 
            to="/about" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
          >
            Our Story
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
          >
            Contact
          </NavLink>
        </nav>

        {/* Header Actions */}
        <div className={styles.actions}>
          {/* Cart Trigger */}
          <button 
            className={styles.cartButton}
            onClick={openCart}
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          <Link to="/catering/quote" className={styles.desktopOnly}>
            <Button variant="primary" size="small">
              Get Instant Quote
            </Button>
          </Link>

          {/* Mobile Hamburger */}
          <button 
            className={styles.mobileMenuBtn} 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawerOverlay} onClick={closeMobileMenu}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <span className={styles.mobileLogo}>{restaurantName}</span>
              <button onClick={closeMobileMenu} className={styles.mobileCloseBtn}>
                <X size={22} />
              </button>
            </div>

            <nav className={styles.mobileNavLinks}>
              <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
              <NavLink to="/menu" onClick={closeMobileMenu}>Explore Menu</NavLink>
              <NavLink to="/catering" onClick={closeMobileMenu}>Catering Services</NavLink>
              <NavLink to="/about" onClick={closeMobileMenu}>Our Story & Reviews</NavLink>
              <NavLink to="/contact" onClick={closeMobileMenu}>Contact & Location</NavLink>
            </nav>

            <div className={styles.mobileDrawerFooter}>
              <Link to="/catering/quote" onClick={closeMobileMenu}>
                <Button variant="primary" size="large" style={{ width: '100%' }}>
                  Request Catering Quote
                </Button>
              </Link>

              <div className={styles.mobileContactBox}>
                <p>📞 Catering: {cateringPhone}</p>
                <p>📍 {settings?.address?.city || 'Hyderabad, Telangana'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
