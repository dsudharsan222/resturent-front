import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import useSettingsStore from '../../store/useSettingsStore';
import styles from './Footer.module.scss';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Footer = () => {
  const { settings: data } = useSettingsStore();

  const restaurantName = data?.name || 'SV Caterers Sri Varsha';
  const tagline = data?.tagline || 'Traditional Flavors • Grand Celebrations • Pure Quality';
  const reservationsPhone = data?.phone_reservations || '+91 90000 12345';
  const cateringPhone = data?.phone_catering || '+91 90000 54321';
  const email = data?.email || 'hello@svcaterers.com';
  const street = data?.address?.street || 'Main Road';
  const city = data?.address?.city || 'Hyderabad';
  const state = data?.address?.state || 'Telangana';
  const zip = data?.address?.zip || '500001';
  const timings = data?.timings || '9:00 AM - 10:00 PM';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.brandLogo}>
            <span className={styles.logoEmblem}>SV</span>
            <div className={styles.brandTitle}>{restaurantName}</div>
          </Link>
          <p className={styles.tagline}>{tagline}</p>
          <p className={styles.description}>
            Bringing authentic culinary heritage and hospitality to your weddings, corporate banquets, and family gatherings.
          </p>

          <div className={styles.socialIcons}>
            <a href={data?.social_media?.instagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={data?.social_media?.facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={data?.social_media?.twitter || '#'} target="_blank" rel="noreferrer" aria-label="Twitter">
              <TwitterIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linksCol}>
          <h3>Quick Navigation</h3>
          <ul>
            <li><Link to="/"><ArrowRight size={14} /> Home</Link></li>
            <li><Link to="/menu"><ArrowRight size={14} /> Our Menu</Link></li>
            <li><Link to="/catering"><ArrowRight size={14} /> Catering Services</Link></li>
            <li><Link to="/catering/quote"><ArrowRight size={14} /> Get Catering Quote</Link></li>
            <li><Link to="/about"><ArrowRight size={14} /> Our Heritage & Story</Link></li>
            <li><Link to="/contact"><ArrowRight size={14} /> Contact & Directions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.contactCol}>
          <h3>Get In Touch</h3>
          <ul className={styles.contactList}>
            <li>
              <Phone size={18} className={styles.contactIcon} />
              <div>
                <strong>Reservations:</strong>
                <span>{reservationsPhone}</span>
              </div>
            </li>
            <li>
              <Phone size={18} className={styles.contactIcon} />
              <div>
                <strong>Event Catering:</strong>
                <span>{cateringPhone}</span>
              </div>
            </li>
            <li>
              <Mail size={18} className={styles.contactIcon} />
              <div>
                <strong>Email:</strong>
                <span>{email}</span>
              </div>
            </li>
            <li>
              <MapPin size={18} className={styles.contactIcon} />
              <div>
                <strong>Address:</strong>
                <span>{street}, {city}, {state} {zip}</span>
              </div>
            </li>
            <li>
              <Clock size={18} className={styles.contactIcon} />
              <div>
                <strong>Timings:</strong>
                <span>{timings}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContainer}`}>
          <p>&copy; {new Date().getFullYear()} {restaurantName}. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link to="/admin/login" className={styles.adminLoginLink}>Staff / Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
