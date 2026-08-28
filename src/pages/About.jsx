import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../services/api';
import useSettingsStore from '../store/useSettingsStore';
import { Star, AlertCircle, Sparkles, Award, HeartHandshake, ShieldCheck, ChefHat } from 'lucide-react';
import styles from './About.module.scss';

const About = () => {
  const { settings: data } = useSettingsStore();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const testData = await getTestimonials().catch(() => []);
        setTestimonials(Array.isArray(testData) ? testData : []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load about page data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const restaurantName = data?.name || 'SV Caterers Sri Varsha';
  const aboutImage = data?.images?.about || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000";
  const galleryImages = data?.images?.gallery || [
    "https://images.unsplash.com/photo-1626779836553-277157bc8105?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600"
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerBadge}>
            <Sparkles size={14} /> Culinary Heritage
          </div>
          <h1 className={styles.title}>Our Story & Traditions</h1>
          <p className={styles.subtitle}>Preserving the authentic culinary heritage of South India across every meal we serve.</p>
        </div>
      </div>

      <div className="container section-padding">
        {/* Story Section */}
        <div className={styles.storyGrid}>
          <div className={styles.imageCard}>
            <img src={aboutImage} alt="SV Caterers Kitchen" className={styles.storyImg} />
            <div className={styles.expOverlay}>
              <strong>25+</strong>
              <span>Years of Flawless Service</span>
            </div>
          </div>

          <div className={styles.storyContent}>
            <span className="eyebrow">The Journey</span>
            <h2>A Legacy Built On Genuine Taste and Warm Hospitality</h2>
            <p className={styles.leadPara}>
              {data?.description || 'Founded with a deep love for authentic South Indian flavors, SV Caterers Sri Varsha has grown into a premier culinary name trusted for grand weddings, housewarming poojas, and distinguished corporate gatherings.'}
            </p>
            <p className={styles.bodyPara}>
              We believe food is not merely sustenance — it is the centerpiece of celebration. Our master chefs prepare each gravy, rice course, and dessert using hand-pounded spices, cold-pressed oils, and farm-fresh ingredients to capture the nostalgia and comfort of traditional home cooking.
            </p>

            <div className={styles.valuesGrid}>
              <div className={styles.valueItem}>
                <ChefHat className={styles.valIcon} size={24} />
                <div>
                  <h4>Authentic Master Chefs</h4>
                  <p>Decades of mastery in Andhra, Telangana, and Udupi culinary styles.</p>
                </div>
              </div>

              <div className={styles.valueItem}>
                <ShieldCheck className={styles.valIcon} size={24} />
                <div>
                  <h4>Strict Hygiene Standards</h4>
                  <p>Sanitized prep kitchens with separate pure vegetarian handling.</p>
                </div>
              </div>

              <div className={styles.valueItem}>
                <HeartHandshake className={styles.valIcon} size={24} />
                <div>
                  <h4>Dedicated Event Management</h4>
                  <p>End-to-end coordination ensuring hot, punctual, and generous service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {galleryImages.length > 0 && (
          <section className={styles.gallerySection}>
            <div className="section-header">
              <span className="eyebrow">Visual Tour</span>
              <h2>Moments from Our Kitchen & Banquets</h2>
              <p>Take a glimpse into our lavish setups, live food stations, and traditional presentation.</p>
            </div>

            <div className={styles.galleryGrid}>
              {galleryImages.map((img, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img src={img} alt={`Culinary Showcase ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews */}
        {testimonials.length > 0 && (
          <section className={styles.reviewsSection}>
            <div className="section-header">
              <span className="eyebrow">Guest Testimonials</span>
              <h2>Words of Appreciation</h2>
              <p>Read what hosts and food lovers have to say about their experience with SV Caterers.</p>
            </div>

            <div className={styles.reviewsGrid}>
              {testimonials.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.stars}>
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className={styles.reviewText}>"{review.text}"</p>
                  <div className={styles.author}>
                    <strong>{review.author}</strong>
                    <span>{review.date ? new Date(review.date).toLocaleDateString() : 'Verified Review'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default About;
