import React, { useState, useEffect } from 'react';
import { getCateringServices } from '../services/api';
import ServiceCard from '../components/UI/ServiceCard';
import EnquiryForm from '../components/UI/EnquiryForm';
import styles from './Catering.module.scss';
import { Sparkles, Calendar, Utensils, CheckCircle, ShieldCheck, Award } from 'lucide-react';

const Catering = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getCateringServices();
        setServices(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load catering services:', err);
        setError(err.message || 'Failed to load catering services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className={styles.cateringPage}>
      {/* Page Hero */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerBadge}>
            <Sparkles size={14} /> Full-Service Culinary Management
          </div>
          <h1 className={styles.title}>Grand Event Catering</h1>
          <p className={styles.subtitle}>
            Unmatched taste, authentic hand-pounded recipes, and royal hospitality for celebrations of 20 to 5,000+ guests.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        {/* Services Showcase */}
        <div className="section-header">
          <span className="eyebrow">Our Packages</span>
          <h2>Tailored For Every Milestone</h2>
          <p>Select your celebration type to explore custom menus, live counter setups, and serving formats.</p>
        </div>

        {loading && (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* How It Works Section */}
        <div className={styles.processSection}>
          <div className="section-header">
            <span className="eyebrow">How It Works</span>
            <h2>Simple 4-Step Catering Experience</h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>01</div>
              <h4>Share Your Vision</h4>
              <p>Tell us your date, venue, guest count, and whether you prefer pure vegetarian or multi-cuisine.</p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>02</div>
              <h4>Bespoke Menu Curation</h4>
              <p>Our culinary specialists recommend authentic courses, signature sweets, and live counter options.</p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>03</div>
              <h4>Tasting & Confirmation</h4>
              <p>Sample key dishes to finalize flavor profiles, serving styles (banana leaf / buffet), and logistics.</p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNum}>04</div>
              <h4>Flawless Execution</h4>
              <p>Our dedicated event managers and chefs handle everything from fresh on-site preparation to spotless service.</p>
            </div>
          </div>
        </div>

        {/* Enquiry Section */}
        <section id="enquiry-form-section" className={styles.enquirySection}>
          <EnquiryForm />
        </section>
      </div>
    </div>
  );
};

export default Catering;
