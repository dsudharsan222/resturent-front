import React from 'react';
import useSettingsStore from '../store/useSettingsStore';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Button from '../components/UI/Button';
import styles from './Contact.module.scss';

const Contact = () => {
  const { settings: data } = useSettingsStore();

  if (!data) return <div className="container section-padding text-center">Loading...</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We'd love to hear from you</p>
        </div>
      </div>

      <div className={`container section-padding ${styles.contentGrid}`}>
        <div className={styles.contactInfo}>
          <h2>Get In Touch</h2>
          <p className={styles.description}>
            Whether you have a question about our menu, want to book a table, or need catering services for your next event, our team is here to help.
          </p>
          
          <ul className={styles.infoList}>
            <li>
              <MapPin className={styles.icon} />
              <div>
                <strong>Location</strong>
                <p>{data.address?.street}, {data.address?.city}, {data.address?.state} {data.address?.zip}</p>
              </div>
            </li>
            <li>
              <Phone className={styles.icon} />
              <div>
                <strong>Reservations & Catering</strong>
                <p>Reservations: {data.phone_reservations}</p>
                <p>Catering: {data.phone_catering}</p>
              </div>
            </li>
            <li>
              <Mail className={styles.icon} />
              <div>
                <strong>Email</strong>
                <p>{data.email}</p>
              </div>
            </li>
            <li>
              <Clock className={styles.icon} />
              <div>
                <strong>Hours of Operation</strong>
                <p>{data.timings}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.contactForm}>
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" required placeholder="John Doe" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required placeholder="john@example.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select id="subject" required>
                <option value="">Select a subject</option>
                <option value="reservation">Table Reservation</option>
                <option value="catering">Catering Inquiry</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" required placeholder="How can we help you?"></textarea>
            </div>
            <Button type="submit" size="large" className={styles.submitBtn}>Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
