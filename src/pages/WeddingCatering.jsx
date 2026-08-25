import React, { useState } from 'react';
import EnquiryForm from '../components/UI/EnquiryForm';
import styles from './WeddingCatering.module.scss';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WeddingCatering = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEnquirySubmit = () => {
    setShowSuccess(true);
    window.scrollTo(0, 0);
  };

  if (showSuccess) {
    return (
      <div className={styles.successPage}>
        <div className="container text-center section-padding">
          <CheckCircle size={80} color="var(--color-success)" className={styles.successIcon} />
          <h1>Enquiry Submitted Successfully!</h1>
          <p>Thank you for choosing SV Caterers Sri Varsha for your big day. Our Wedding Event Manager will reach out to you within 24 hours.</p>
          <Link to="/" className={styles.homeLink}>Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.weddingPage}>
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1>Grand Wedding Catering</h1>
          <p>Crafting unforgettable culinary experiences for your special day.</p>
        </div>
      </div>

      <div className={`container section-padding ${styles.contentGrid}`}>
        <div className={styles.infoSection}>
          <h2>Why Choose Us for Your Wedding?</h2>
          <p className={styles.lead}>
            At SV Caterers Sri Varsha, we understand that food is the heart of any Indian wedding. 
            We bring decades of experience, traditional recipes, and modern presentation to ensure 
            your guests leave with a memorable dining experience.
          </p>
          
          <ul className={styles.featureList}>
            <li>
              <strong>Authentic Taste</strong>
              <p>Hand-pounded spices and generations-old recipes.</p>
            </li>
            <li>
              <strong>Premium Setup</strong>
              <p>Elegant buffet counters, live stations, and traditional banana leaf serving.</p>
            </li>
            <li>
              <strong>Hygiene First</strong>
              <p>Strict quality control and sanitized kitchen environments.</p>
            </li>
            <li>
              <strong>Dedicated Management</strong>
              <p>A personal event manager to handle all food-related logistics.</p>
            </li>
          </ul>

          <div className={styles.galleryPreview}>
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400" alt="Wedding Setup" />
            <img src="https://images.unsplash.com/photo-1530103862676-de3c9de59a9e?auto=format&fit=crop&q=80&w=400" alt="Live Counters" />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Plan Your Wedding Menu</h3>
          <p>Fill out the details below to receive a customized quotation.</p>
          <EnquiryForm predefinedEvent="wedding" onSubmitSuccess={handleEnquirySubmit} />
        </div>
      </div>
    </div>
  );
};

export default WeddingCatering;
