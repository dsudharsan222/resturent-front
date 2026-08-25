import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCateringServices, getFeaturedMenuItems, getTestimonials, submitTestimonial } from '../services/api';
import useSettingsStore from '../store/useSettingsStore';
import Button from '../components/UI/Button';
import ServiceCard from '../components/UI/ServiceCard';
import FoodCard from '../components/UI/FoodCard';
import FoodDetailPopup from '../components/Menu/FoodDetailPopup';
import styles from './Home.module.scss';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Home = () => {
  const { settings: data } = useSettingsStore();
  const [services, setServices] = useState([]);
  const [featuredMenu, setFeaturedMenu] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Testimonial Form State
  const [testForm, setTestForm] = useState({ author: '', rating: 5, text: '' });
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testMessage, setTestMessage] = useState(null);
  const [testError, setTestError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        // Fetch non-critical data
        const [srvRes, menuRes, testRes] = await Promise.allSettled([
          getCateringServices(),
          getFeaturedMenuItems(),
          getTestimonials()
        ]);

        setServices(srvRes.status === 'fulfilled' ? srvRes.value : []);
        setFeaturedMenu(menuRes.status === 'fulfilled' ? menuRes.value : []);
        setTestimonials(testRes.status === 'fulfilled' ? testRes.value : []);
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load core home page data.');
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestSubmitting(true);
    setTestMessage(null);
    setTestError(null);
    try {
      const res = await submitTestimonial({ ...testForm, rating: Number(testForm.rating) });
      setTestMessage(res.message || 'Thank you for your review!');
      setTestForm({ author: '', rating: 5, text: '' });
    } catch (err) {
      setTestError(err.message);
    } finally {
      setTestSubmitting(false);
    }
  };

  if (loading) return <div className="container section-padding text-center">Loading...</div>;
  if (error) return (
    <div className="container section-padding text-center">
      <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
      <h2 style={{ color: 'var(--color-danger)' }}>Oops! Something went wrong.</h2>
      <p>{error}</p>
      <Button onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>Try Again</Button>
    </div>
  );

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      {data.images?.hero && (
        <section className={styles.hero} style={{ backgroundImage: `url(${data.images.hero})` }}>
          <div className={styles.heroOverlay}></div>
          <div className={`container ${styles.heroContent}`}>
            <h1>{data.name}</h1>
            <p className={styles.tagline}>{data.tagline || ''}</p>
            <div className={styles.heroActions}>
              <Link to="/catering"><Button size="large">Book Catering</Button></Link>
              <Link to="/menu"><Button variant="outline" size="large">View Menu</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className={`${styles.aboutPreview} section-padding`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h2 className="section-title">A Legacy of Taste</h2>
              <p className={styles.description}>{data.description}</p>
              <Link to="/about"><Button variant="outline">Our Story</Button></Link>
            </div>
            {data.images?.about && (
              <div className={styles.aboutImages}>
                <img src={data.images.about} alt="About Us" className={styles.mainImg} loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className={`${styles.servicesSection} section-padding`}>
        <div className="container">
          <h2 className="section-title text-center">Our Catering Services</h2>
          <p className="text-center mb-xl" style={{ color: 'var(--color-text-muted)' }}>From intimate gatherings to grand celebrations, we bring the best flavors to your event.</p>
          <div className={styles.servicesGrid}>
            {services.slice(0, 3).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-lg">
            <Link to="/catering"><Button>View All Services</Button></Link>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className={`${styles.featuredMenuSection} section-padding`}>
        <div className="container">
          <h2 className="section-title text-center">Culinary Highlights</h2>
          <p className="text-center mb-xl" style={{ color: 'var(--color-text-muted)' }}>Explore a preview of our authentic South Indian delicacies.</p>
          <div className={styles.menuGrid}>
            {featuredMenu.map(item => (
              <FoodCard key={item.id} item={item} onViewDetails={setSelectedFood} />
            ))}
          </div>
          <div className="text-center mt-lg">
            <Link to="/menu"><Button variant="outline">Explore Full Menu</Button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.testimonialsSection} section-padding`}>
        <div className="container">
          <h2 className="section-title text-center" style={{ color: 'var(--color-secondary)' }}>Client Diaries</h2>
          <div className={styles.testimonialsGrid} style={{ marginBottom: '3rem' }}>
            {testimonials.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <p className={styles.reviewText}>"{review.text}"</p>
                <div className={styles.author}>- {review.author}</div>
              </div>
            ))}
          </div>
          
          {/* Submit Testimonial Form */}
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', background: 'var(--color-bg-light)', borderRadius: '12px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Leave a Review</h3>
            {testMessage && (
              <div style={{ padding: '1rem', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} />
                {testMessage}
              </div>
            )}
            {testError && (
              <div style={{ padding: '1rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} />
                {testError}
              </div>
            )}
            <form onSubmit={handleTestimonialSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={testForm.author}
                  onChange={(e) => setTestForm({...testForm, author: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border-alt)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" max="5" 
                  required 
                  value={testForm.rating}
                  onChange={(e) => setTestForm({...testForm, rating: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border-alt)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Review</label>
                <textarea 
                  required 
                  rows="4" 
                  value={testForm.text}
                  onChange={(e) => setTestForm({...testForm, text: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border-alt)', borderRadius: '4px' }}
                ></textarea>
              </div>
              <Button type="submit" style={{ width: '100%' }} disabled={testSubmitting}>
                {testSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {selectedFood && (
        <FoodDetailPopup item={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default Home;
