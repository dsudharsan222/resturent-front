import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSingleCateringService, getCateringServices } from '../services/api';
import EnquiryForm from '../components/UI/EnquiryForm';
import styles from './CateringServiceDetail.module.scss';
import { CheckCircle, AlertCircle, ArrowLeft, Users, Clock, Utensils, HelpCircle } from 'lucide-react';
import Button from '../components/UI/Button';

const CateringServiceDetail = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [data, allData] = await Promise.all([
          getSingleCateringService(serviceId).catch(() => null),
          getCateringServices().catch(() => [])
        ]);

        if (data) {
          setService(data);
        } else {
          setError('Catering service package not found.');
        }
        
        if (allData && Array.isArray(allData)) {
          setAllServices(allData.filter((s) => s.id !== serviceId));
        }
      } catch (err) {
        console.error('Failed to load catering details:', err);
        setError('Failed to load catering service details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceData();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="container section-padding text-center">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px', marginBottom: '1.5rem' }}></div>
          <div className="skeleton" style={{ height: '32px', width: '60%', margin: '0 auto 1rem' }}></div>
          <div className="skeleton" style={{ height: '18px', width: '80%', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container section-padding text-center">
        <AlertCircle size={54} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
        <h2>Package Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          The requested catering service could not be found or has been updated.
        </p>
        <Link to="/catering">
          <Button variant="primary">
            <ArrowLeft size={16} /> View All Catering Services
          </Button>
        </Link>
      </div>
    );
  }

  const heroImage = service.image_url || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className={styles.servicePage}>
      {/* Hero Header */}
      <div className={styles.heroSection} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.overlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <Link to="/catering" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to All Services
          </Link>
          <h1 className={styles.heroTitle}>{service.name}</h1>
          <p className={styles.heroTagline}>
            {service.capacity ? `Accommodating ${service.capacity} with grand hospitality.` : 'Tailored catering for your milestone celebrations.'}
          </p>
        </div>
      </div>

      <div className={`container section-padding ${styles.contentGrid}`}>
        {/* Left Column: Details, Benefits, FAQs */}
        <div className={styles.infoSection}>
          {/* At A Glance */}
          <div className={styles.atAGlance}>
            <h3>Event Package Overview</h3>
            <div className={styles.glanceGrid}>
              <div className={styles.glanceItem}>
                <Users className={styles.glanceIcon} size={20} />
                <div>
                  <strong>Capacity</strong>
                  <span>{service.capacity || '50+ Guests'}</span>
                </div>
              </div>
              <div className={styles.glanceItem}>
                <Utensils className={styles.glanceIcon} size={20} />
                <div>
                  <strong>Serving Styles</strong>
                  <span>Banana Leaf / Grand Buffet</span>
                </div>
              </div>
              <div className={styles.glanceItem}>
                <Clock className={styles.glanceIcon} size={20} />
                <div>
                  <strong>Recommended Notice</strong>
                  <span>3 to 7 Days Ahead</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.descriptionBlock}>
            <h2>Why Choose SV Caterers for {service.name}?</h2>
            <p className={styles.leadText}>
              {service.description || "We combine generations-old family recipes with flawless event management to guarantee an extraordinary dining experience for your guests."}
            </p>
          </div>

          {/* Benefits & Features */}
          {service.benefits && service.benefits.length > 0 && (
            <div className={styles.featureBlock}>
              <h3>Included Features & Highlights</h3>
              <ul className={styles.featureList}>
                {service.benefits.map((benefitItem, index) => (
                  <li key={index}>
                    <CheckCircle size={18} className={styles.checkIcon} />
                    <span>{typeof benefitItem === 'object' ? benefitItem.benefit : benefitItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Menu Styles */}
          {service.menu_options && service.menu_options.length > 0 && (
            <div className={styles.menuOptionsBlock}>
              <h3>Curated Menu Styles</h3>
              <div className={styles.menuPills}>
                {service.menu_options.map((menuItem, index) => (
                  <span key={index} className={styles.menuPill}>
                    🍲 {typeof menuItem === 'object' ? menuItem.menu_option : menuItem}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          <div className={styles.faqSection}>
            <h3><HelpCircle size={20} /> Frequently Asked Questions</h3>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <strong>Do you provide live counters for {service.name}?</strong>
                <p>Yes, live counters (Dosa, Chaat, Jalebi, Tawa Fry) can be seamlessly integrated into any menu tier.</p>
              </div>
              <div className={styles.faqItem}>
                <strong>Can we customize the menu courses?</strong>
                <p>Absolutely. Every single menu is 100% customizable to honor your regional preferences, family traditions, and dietary requirements.</p>
              </div>
              <div className={styles.faqItem}>
                <strong>How does the booking process work?</strong>
                <p>Submit your quote inquiry using the form on this page. Our event coordinator will contact you with a transparent menu quotation and schedule a tasting session.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Quote Form */}
        <div className={styles.formSection}>
          <div className={styles.stickyWrapper}>
            <EnquiryForm predefinedEvent={service.id} />
          </div>
        </div>
      </div>

      {/* Other Catering Packages */}
      {allServices.length > 0 && (
        <section className={styles.otherEventsSection}>
          <div className="container">
            <h2>Explore Other Occasions We Cater</h2>
            <div className={styles.otherEventsGrid}>
              {allServices.slice(0, 4).map((s) => (
                <Link key={s.id} to={s.path || `/catering/${s.id}`} className={styles.otherEventCard}>
                  <h4>{s.name}</h4>
                  <span>{s.capacity || 'Explore details →'}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CateringServiceDetail;
