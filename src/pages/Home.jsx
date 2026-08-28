import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getCateringServices, 
  getFeaturedMenuItems, 
  getTestimonials, 
  submitTestimonial 
} from '../services/api';
import useSettingsStore from '../store/useSettingsStore';
import Button from '../components/UI/Button';
import ServiceCard from '../components/UI/ServiceCard';
import FoodCard from '../components/UI/FoodCard';
import FoodDetailPopup from '../components/Menu/FoodDetailPopup';
import styles from './Home.module.scss';
import { 
  Award, 
  Users, 
  ShieldCheck, 
  ChefHat, 
  Star, 
  ArrowRight, 
  Sparkles, 
  UtensilsCrossed, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [testSubmitted, setTestSubmitted] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [srvRes, menuRes, testRes] = await Promise.allSettled([
          getCateringServices(),
          getFeaturedMenuItems(),
          getTestimonials()
        ]);

        setServices(srvRes.status === 'fulfilled' && Array.isArray(srvRes.value) ? srvRes.value : []);
        setFeaturedMenu(menuRes.status === 'fulfilled' && Array.isArray(menuRes.value) ? menuRes.value : []);
        setTestimonials(testRes.status === 'fulfilled' && Array.isArray(testRes.value) ? testRes.value : []);
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load home page data.');
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestSubmitting(true);
    try {
      await submitTestimonial({ ...testForm, rating: Number(testForm.rating) });
      toast.success('Thank you! Your review has been submitted for approval.');
      setTestSubmitted(true);
      setTestForm({ author: '', rating: 5, text: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setTestSubmitting(false);
    }
  };

  const heroImage = data?.images?.hero || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600";
  const restaurantName = data?.name || 'SV Caterers Sri Varsha';
  const tagline = data?.tagline || 'Experience Authentic Flavors & Grand Hospitality';

  return (
    <div className={styles.homePage}>
      {/* 1. HERO SECTION */}
      <section className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Sparkles size={15} />
            <span>Grand Catering & Authentic Dining</span>
          </div>

          <h1 className={styles.heroTitle}>{restaurantName}</h1>
          <p className={styles.heroTagline}>{tagline}</p>

          <p className={styles.heroDescription}>
            From lavish wedding banquets to intimate corporate celebrations, we serve handcrafted South Indian and royal culinary delicacies prepared with fresh local ingredients and age-old recipes.
          </p>

          <div className={styles.heroActions}>
            <Link to="/catering/quote">
              <Button variant="primary" size="large" className={styles.heroCta}>
                <Sparkles size={18} /> Request Event Quote
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outlineWhite" size="large">
                <UtensilsCrossed size={18} /> Explore Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Trust Metrics */}
        <div className={styles.trustBar}>
          <div className={`container ${styles.trustContainer}`}>
            <div className={styles.trustItem}>
              <Award className={styles.trustIcon} size={28} />
              <div>
                <strong>25+ Years</strong>
                <span>Culinary Heritage</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <Users className={styles.trustIcon} size={28} />
              <div>
                <strong>10,000+ Events</strong>
                <span>Successfully Catered</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <ShieldCheck className={styles.trustIcon} size={28} />
              <div>
                <strong>100% Sanitized</strong>
                <span>Hygienic Kitchens</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <ChefHat className={styles.trustIcon} size={28} />
              <div>
                <strong>Master Chefs</strong>
                <span>Handcrafted Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT & HERITAGE PREVIEW */}
      <section className={`${styles.aboutSection} section-padding`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutTextCol}>
              <div className="section-header text-left" style={{ margin: 0 }}>
                <span className="eyebrow">Our Heritage</span>
                <h2>Crafting Unforgettable Flavors Since Inception</h2>
              </div>

              <p className={styles.aboutLead}>
                {data?.description || 'At SV Caterers Sri Varsha, we bring the authentic culinary traditions of South India to life. Every dish tells a story of passion, heritage, and genuine hospitality.'}
              </p>

              <div className={styles.pillarsGrid}>
                <div className={styles.pillar}>
                  <div className={styles.pillarDot}></div>
                  <div>
                    <h4>Hand-Ground Spices</h4>
                    <p>Authentic masalas pounded in-house for rich aromatic depth.</p>
                  </div>
                </div>

                <div className={styles.pillar}>
                  <div className={styles.pillarDot}></div>
                  <div>
                    <h4>Pure & Fresh Ingredients</h4>
                    <p>Farm-fresh produce and high-grade cooking mediums.</p>
                  </div>
                </div>

                <div className={styles.pillar}>
                  <div className={styles.pillarDot}></div>
                  <div>
                    <h4>Flawless Event Service</h4>
                    <p>Punctual delivery, live food counters, and royal banana leaf serving.</p>
                  </div>
                </div>
              </div>

              <div className={styles.aboutActions}>
                <Link to="/about">
                  <Button variant="outline" size="medium">
                    Read Our Full Story <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/catering">
                  <Button variant="ghost" size="medium">
                    View Catering Formats →
                  </Button>
                </Link>
              </div>
            </div>

            <div className={styles.aboutImageCol}>
              <div className={styles.imageCardWrapper}>
                <img 
                  src={data?.images?.about || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"} 
                  alt="SV Caterers Kitchen & Dining" 
                  className={styles.aboutMainImg} 
                  loading="lazy"
                />
                <div className={styles.floatingExpBadge}>
                  <span className={styles.expNumber}>25+</span>
                  <span className={styles.expLabel}>Years of Authentic Flavors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATERING SERVICES SHOWCASE */}
      <section className={`${styles.servicesSection} section-padding`}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Event Catering</span>
            <h2>Bespoke Catering For Every Occasion</h2>
            <p>From intimate home functions to grand destination weddings, our bespoke packages ensure seamless hospitality and extraordinary dining.</p>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.servicesGrid}>
              {services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className={styles.servicesCtaWrap}>
            <Link to="/catering">
              <Button variant="primary" size="large">
                Explore All {services.length} Catering Packages <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CULINARY HIGHLIGHTS (FEATURED DISHES) */}
      <section className={`${styles.menuSection} section-padding`}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Signature Dishes</span>
            <h2>Culinary Highlights</h2>
            <p>A handpicked selection of our most loved specialties, prepared with authentic recipes and served piping hot.</p>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.menuGrid}>
              {featuredMenu.map((item) => (
                <FoodCard 
                  key={item.id} 
                  item={item} 
                  onViewDetails={setSelectedFood} 
                />
              ))}
            </div>
          )}

          <div className={styles.menuCtaWrap}>
            <Link to="/menu">
              <Button variant="gold" size="large">
                <UtensilsCrossed size={18} /> View Full Menu & Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & CLIENT DIARIES */}
      <section className={`${styles.testimonialsSection} section-padding`}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Customer Love</span>
            <h2>What Our Patrons Say</h2>
            <p>Real stories from families, couples, and corporate hosts who celebrated their milestones with our catering team.</p>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.stars}>
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
                <div className={styles.authorInfo}>
                  <strong>{review.author}</strong>
                  <span>Verified Guest</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Review Submission Card */}
          <div className={styles.submitReviewCard}>
            <div className={styles.reviewCardHeader}>
              <Sparkles size={20} className={styles.reviewIcon} />
              <h3>Enjoyed our Food or Service?</h3>
              <p>Leave a review to help us continually deliver the highest standard of culinary joy.</p>
            </div>

            {testSubmitted ? (
              <div className={styles.reviewSuccess}>
                <CheckCircle2 size={40} color="var(--color-success)" />
                <h4>Thank You For Your Feedback!</h4>
                <p>Your review has been submitted for moderation and will appear on the site shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleTestimonialSubmit} className={styles.reviewForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Ananya Rao"
                      value={testForm.author}
                      onChange={(e) => setTestForm({ ...testForm, author: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Rating (1-5 Stars)</label>
                    <select 
                      value={testForm.rating}
                      onChange={(e) => setTestForm({ ...testForm, rating: e.target.value })}
                    >
                      <option value="5">★★★★★ (5 - Outstanding)</option>
                      <option value="4">★★★★☆ (4 - Very Good)</option>
                      <option value="3">★★★☆☆ (3 - Good)</option>
                      <option value="2">★★☆☆☆ (2 - Fair)</option>
                      <option value="1">★☆☆☆☆ (1 - Poor)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Your Review Message *</label>
                  <textarea 
                    required 
                    rows="3" 
                    placeholder="Tell us about the dishes you loved, event service, presentation..."
                    value={testForm.text}
                    onChange={(e) => setTestForm({ ...testForm, text: e.target.value })}
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="medium"
                  loading={testSubmitting}
                  className={styles.submitReviewBtn}
                >
                  Submit Public Review
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaText}>
              <h2>Planning an Upcoming Celebration?</h2>
              <p>Get in touch with our event planners to craft a custom menu tailored to your guests and budget.</p>
            </div>
            <div className={styles.ctaButtons}>
              <Link to="/catering/quote">
                <Button variant="gold" size="large">
                  <Sparkles size={18} /> Request Custom Quote
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outlineWhite" size="large">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Food Quick View Modal */}
      {selectedFood && (
        <FoodDetailPopup item={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default Home;
