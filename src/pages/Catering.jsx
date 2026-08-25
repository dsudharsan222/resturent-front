import React, { useState, useEffect } from 'react';
import { getCateringServices } from '../services/api';
import ServiceCard from '../components/UI/ServiceCard';
import EnquiryForm from '../components/UI/EnquiryForm';
import styles from './Catering.module.scss';
import { AlertCircle } from 'lucide-react';

const Catering = () => {
  const [services, setServices] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getCateringServices();
        setServices(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load catering services.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleEnquirySubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className={styles.cateringPage}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>Catering Services</h1>
          <p className={styles.subtitle}>Premium catering for every occasion</p>
        </div>
      </div>

      <div className={`container section-padding`}>
        {loading && <div className="text-center" style={{ padding: '40px' }}>Loading...</div>}
        
        {error && (
          <div className="text-center" style={{ padding: '40px', color: 'var(--color-danger)' }}>
            <AlertCircle size={48} style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <h2>Failed to load services</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.servicesGrid}>
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        <section className={styles.enquirySection}>
          <div className={styles.enquiryContent}>
            <h2>Request a Custom Quote</h2>
            <p>Not sure which service fits best? Fill out the form below and our event managers will get in touch with you to craft the perfect menu for your event.</p>
            
            {showSuccess && (
              <div className={styles.successMessage}>
                Thank you! Your enquiry has been received. Our team will contact you shortly.
              </div>
            )}

            <EnquiryForm onSubmitSuccess={handleEnquirySubmit} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catering;
