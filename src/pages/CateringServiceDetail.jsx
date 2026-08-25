import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSingleCateringService } from '../services/api';
import EnquiryForm from '../components/UI/EnquiryForm';
import styles from './CateringServiceDetail.module.scss';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';

const CateringServiceDetail = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch both single service and all services in parallel
        const [data, allData] = await Promise.all([
          getSingleCateringService(serviceId).catch(() => null),
          import('../services/api').then(m => m.getCateringServices()).catch(() => [])
        ]);

        if (data) {
          setService(data);
        } else {
          setError('Service not found');
        }
        
        if (allData && Array.isArray(allData)) {
          setAllServices(allData.filter(s => s.id !== serviceId)); // Exclude current
        }
      } catch (err) {
        setError('Failed to load catering service details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [serviceId]);

  const handleEnquirySubmit = () => {
    setShowSuccess(true);
    window.scrollTo(0, 0);
  };

  if (loading) return <div className="container section-padding text-center">Loading...</div>;

  if (error || !service) return (
    <div className="container section-padding text-center">
      <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
      <h2 style={{ color: 'var(--color-danger)' }}>Oops!</h2>
      <p>{error || 'This catering service does not exist.'}</p>
      <Link to="/catering"><Button style={{ marginTop: '1rem' }}>View All Catering Services</Button></Link>
    </div>
  );

  if (showSuccess) {
    return (
      <div className={styles.successPage}>
        <div className="container text-center section-padding">
          <CheckCircle size={80} color="var(--color-success)" className={styles.successIcon} />
          <h1>Enquiry Submitted Successfully!</h1>
          <p>Thank you for choosing SV Caterers for your event. Our team will reach out to you within 24 hours.</p>
          <Link to="/" className={styles.homeLink}>Return to Home</Link>
        </div>
      </div>
    );
  }

  // Fallback hero image if not provided
  const heroImage = service.image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className={styles.servicePage}>
      <div className={styles.heroSection} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.overlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1>{service.name}</h1>
          <p>{service.capacity ? `Accommodating ${service.capacity} guests.` : 'Crafting unforgettable culinary experiences for your special day.'}</p>
        </div>
      </div>

      <div className={`container section-padding ${styles.contentGrid}`}>
        <div className={styles.infoSection}>
          <div className={styles.atAGlance}>
            <h3>At a Glance</h3>
            <div className={styles.glanceGrid}>
              <div className={styles.glanceItem}>
                <strong>Capacity</strong>
                <span>{service.capacity || '50+ Guests'}</span>
              </div>
              <div className={styles.glanceItem}>
                <strong>Format</strong>
                <span>Customizable / Buffet</span>
              </div>
              <div className={styles.glanceItem}>
                <strong>Lead Time</strong>
                <span>5 to 7 days recommended</span>
              </div>
            </div>
          </div>

          <h2>Why Choose Us for {service.name}?</h2>
          <p className={styles.lead}>
            {service.description || "We bring decades of experience, traditional recipes, and modern presentation to ensure your guests leave with a memorable dining experience."}
          </p>
          
          {service.benefits && service.benefits.length > 0 && (
            <>
              <h3>Features & Benefits</h3>
              <ul className={styles.featureList}>
                {service.benefits.map((benefitItem, index) => (
                  <li key={index}>
                    <CheckCircle size={20} className={styles.checkIcon} />
                    <span>{typeof benefitItem === 'object' ? benefitItem.benefit : benefitItem}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

            {service.menu_options && service.menu_options.length > 0 && (
            <>
              <h3 style={{ marginTop: '2rem' }}>Available Menu Options</h3>
              <ul className={styles.featureList}>
                {service.menu_options.map((menuItem, index) => (
                  <li key={index}>
                    <CheckCircle size={20} className={styles.checkIcon} />
                    <span>{typeof menuItem === 'object' ? menuItem.menu_option : menuItem}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className={styles.faqSection} style={{ marginTop: '3rem' }}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqItem}>
              <strong>What is the minimum order for {service.name}?</strong>
              <p>Minimum orders typically start at 50 guests, but can vary based on the specific menu and service style. Please submit a quote request for details.</p>
            </div>
            <div className={styles.faqItem}>
              <strong>How much notice do you need?</strong>
              <p>We recommend booking at least 5 to 7 days in advance to ensure the highest quality of service and menu availability.</p>
            </div>
            <div className={styles.faqItem}>
              <strong>Do you provide live counters?</strong>
              <p>Yes, live counters (chaat, dosa, jalebi) are highly popular and can be added to any buffet package.</p>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Plan Your Menu</h3>
          <p>Fill out the details below to receive a customized quotation.</p>
          <EnquiryForm predefinedEvent={service.id} onSubmitSuccess={handleEnquirySubmit} />
        </div>
      </div>

      {allServices.length > 0 && (
        <div className={styles.otherEventsSection}>
          <div className="container section-padding">
            <h2>Other events we cater</h2>
            <div className={styles.otherEventsGrid}>
              {allServices.map(s => (
                <Link key={s.id} to={s.path || `/catering/${s.id}`} className={styles.otherEventCard}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringServiceDetail;
