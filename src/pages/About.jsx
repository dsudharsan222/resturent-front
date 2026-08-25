import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../services/api';
import useSettingsStore from '../store/useSettingsStore';
import { Star, AlertCircle } from 'lucide-react';
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
        setTestimonials(testData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load about page data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) return <div className="container section-padding text-center">Loading...</div>;
  if (error) return (
    <div className="container section-padding text-center">
      <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
      <h2 style={{ color: 'var(--color-danger)' }}>Oops! Something went wrong.</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <div className={styles.aboutPage}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>Our Story</h1>
          <p className={styles.subtitle}>Bringing the true taste of tradition</p>
        </div>
      </div>

      <div className={`container section-padding`}>
        <div className={styles.storySection}>
          {data.images?.about && (
            <img src={data.images.about} alt="Our Story" className={styles.mainImage} />
          )}
          <div className={styles.textContent}>
            <h2>{data.name}</h2>
            {data.description && <p className={styles.description}>{data.description}</p>}
            <p className={styles.description}>
              Founded in 2022, our journey began with a simple idea: to bring authentic recipes from Andhra, Telangana, and Karnataka under one roof. Our chefs use hand-pounded spices, fresh local ingredients, and age-old cooking techniques to recreate the magic of South Indian kitchens.
            </p>
          </div>
        </div>

        {data.images?.gallery && data.images.gallery.length > 0 && (
          <section className={styles.gallerySection}>
            <h2 className="text-center mb-md">Our Gallery</h2>
            <div className={styles.galleryGrid}>
              {data.images.gallery.map((img, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img src={img} alt={`Gallery ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        {testimonials.length > 0 && (
          <section className={styles.reviewsSection}>
            <h2 className="text-center mb-md">What Our Customers Say</h2>
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
                    <span>{review.date ? new Date(review.date).toLocaleDateString() : ''}</span>
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
