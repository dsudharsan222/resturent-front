import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import styles from './Footer.module.scss';

const Footer = () => {
  const { settings: data } = useSettingsStore();

  if (!data) return null;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brand}>
          <h2>{data.name}</h2>
          <p>{data.tagline}</p>
          <div className={styles.socials}>
            <a href={data.social_media?.instagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
              IG
            </a>
            <a href={data.social_media?.facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
              FB
            </a>
          </div>
        </div>

        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h3>Contact Us</h3>
          <ul>
            <li>
              <Phone size={18} />
              <span>Reservations: {data.phone_reservations}</span>
            </li>
            <li>
              <Phone size={18} />
              <span>Catering: {data.phone_catering}</span>
            </li>
            <li>
              <Mail size={18} />
              <span>{data.email}</span>
            </li>
            <li>
              <MapPin size={18} />
              <span>{data.address?.street}, {data.address?.city}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} {data.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
