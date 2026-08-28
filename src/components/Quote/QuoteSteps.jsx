import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getQuoteData, submitQuoteRequest, getCateringServices } from '../../services/api';
import styles from './QuoteSteps.module.scss';
import Button from '../UI/Button';
import { CheckCircle, AlertCircle, Sparkles, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const useQuoteConfig = (configKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadConfig = async () => {
      try {
        setLoading(true);
        const config = await getQuoteData();
        if (isMounted) {
          setData(config[configKey] || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load options.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadConfig();
    return () => { isMounted = false; };
  }, [configKey]);

  return { data, loading, error };
};

/* STEP 1: EVENT TYPE */
export const StepEventType = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getCateringServices();
        if (isMounted && data && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        if (isMounted) setError('Failed to load event types.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchServices();
    return () => { isMounted = false; };
  }, []);

  const handleSelect = (id) => {
    navigate(`/catering/quote/${id}`);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>What type of event are you planning?</h2>
        <p>Select your occasion to help our chefs tailor the ideal courses and live counter arrangements.</p>
      </div>
      
      {loading && (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: '90px', borderRadius: '12px' }}></div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className={styles.optionsGrid}>
          {events.map((event) => (
            <button 
              key={event.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(event.id)}
            >
              <div className={styles.cardInfo}>
                <span className={styles.optionName}>{event.name}</span>
                {event.capacity && <span className={styles.optionMeta}>{event.capacity}</span>}
              </div>
              <ArrowRight size={18} className={styles.arrowIcon} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* STEP 2: GUEST COUNT */
export const StepGuests = () => {
  const { data: guests, loading, error } = useQuoteConfig('guestCounts');
  const { eventType } = useParams();
  const navigate = useNavigate();
  const [showOther, setShowOther] = useState(false);
  const [exactGuests, setExactGuests] = useState('');

  const handleSelect = (id) => {
    navigate(`/catering/quote/${eventType}/${id}`);
  };

  const handleNextExact = () => {
    if (exactGuests && parseInt(exactGuests, 10) > 0) {
      navigate(`/catering/quote/${eventType}/${exactGuests}`);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>How many guests are you expecting?</h2>
        <p>Our kitchen manages events from 20 to 5,000+ attendees with customized batch preparation.</p>
      </div>
      
      {loading && (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: '90px', borderRadius: '12px' }}></div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {!loading && !error && !showOther && (
        <div className={styles.optionsGrid}>
          {guests.map((guest) => (
            <button 
              key={guest.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(guest.id)}
            >
              <div className={styles.cardInfo}>
                <span className={styles.optionName}>{guest.name}</span>
                <span className={styles.optionMeta}>Estimated Group Size</span>
              </div>
              <ArrowRight size={18} className={styles.arrowIcon} />
            </button>
          ))}
          <button 
            className={clsx(styles.optionCard, styles.otherCard)}
            onClick={() => setShowOther(true)}
          >
            <div className={styles.cardInfo}>
              <span className={styles.optionName}>Other / Exact Headcount</span>
              <span className={styles.optionMeta}>Enter custom number</span>
            </div>
            <ArrowRight size={18} className={styles.arrowIcon} />
          </button>
        </div>
      )}

      {showOther && (
        <div className={styles.customGuestBox}>
          <label>Enter Exact Headcount</label>
          <input 
            type="number" 
            placeholder="e.g., 250" 
            min="1" 
            value={exactGuests}
            onChange={(e) => setExactGuests(e.target.value)}
            className={styles.customInput}
            autoFocus
          />
          <div className={styles.customActions}>
            <Button variant="ghost" onClick={() => setShowOther(false)}>Back</Button>
            <Button variant="primary" onClick={handleNextExact} disabled={!exactGuests || parseInt(exactGuests, 10) < 1}>
              Continue to Step 3 <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/* STEP 3: FOOD PREFERENCE */
export const StepPreference = () => {
  const { data: preferences, loading, error } = useQuoteConfig('foodPreferences');
  const { eventType, guests } = useParams();
  const navigate = useNavigate();

  const handleSelect = (id) => {
    navigate(`/catering/quote/${eventType}/${guests}/${id}/contact`);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2>What is your food preference?</h2>
        <p>We maintain strictly segregated kitchens and prep stations for pure vegetarian banquets.</p>
      </div>
      
      {loading && (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: '90px', borderRadius: '12px' }}></div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className={styles.optionsGrid}>
          {preferences.map((pref) => {
            const isVeg = pref.id.toLowerCase().includes('veg') && !pref.id.toLowerCase().includes('both') && !pref.id.toLowerCase().includes('non');
            const isBoth = pref.id.toLowerCase().includes('both');

            return (
              <button 
                key={pref.id} 
                className={styles.optionCard}
                onClick={() => handleSelect(pref.id)}
              >
                <div className={styles.cardInfo}>
                  <span className={styles.optionName}>{pref.name}</span>
                  <span className={styles.optionMeta}>
                    {isVeg ? 'Strict Sattvic / Pure Veg Prep' : isBoth ? 'Veg & Non-Veg Multi-Cuisine' : 'Authentic Meat & Poultry Courses'}
                  </span>
                </div>
                <ArrowRight size={18} className={styles.arrowIcon} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* STEP 4: CONTACT & DATE SUBMISSION */
export const StepContact = () => {
  const { eventType, guests, preference } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    event_date: '',
    meal_type: 'lunch',
    venue: '',
    special_requirements: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      event_type_id: eventType,
      guest_count_id: guests,
      food_preference_id: preference,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email || undefined,
      event_date: formData.event_date ? new Date(formData.event_date).toISOString() : undefined,
    };

    try {
      await submitQuoteRequest(payload);
      toast.success('Your catering quote request has been sent successfully!');
      navigate('/catering/quote/success');
    } catch (err) {
      console.error('Failed to submit quote request:', err);
      setError(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.stepContactLayout}>
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <h2>Final Step: Contact & Event Logistics</h2>
          <p>Please provide your contact details so our catering specialist can send your custom menu estimate.</p>
        </div>
        
        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input 
                name="customer_name" 
                value={formData.customer_name} 
                onChange={handleChange} 
                type="text" 
                required 
                placeholder="e.g. Vikram Reddy" 
              />
            </div>
            <div className={styles.formGroup}>
              <label>WhatsApp / Phone Number *</label>
              <input 
                name="customer_phone" 
                value={formData.customer_phone} 
                onChange={handleChange} 
                type="tel" 
                required 
                placeholder="+91 98765 43210" 
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                name="customer_email" 
                value={formData.customer_email} 
                onChange={handleChange} 
                type="email" 
                placeholder="vikram@example.com" 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Event Date *</label>
              <input 
                name="event_date" 
                value={formData.event_date} 
                onChange={handleChange} 
                type="date" 
                required 
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Meal Type / Service Slot</label>
              <select name="meal_type" value={formData.meal_type} onChange={handleChange}>
                <option value="breakfast">Breakfast / Morning Tiffins</option>
                <option value="lunch">Grand Lunch Banquet</option>
                <option value="dinner">Evening Dinner / Reception</option>
                <option value="full_day">Full Day Multiple Courses</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Event Venue / Locality</label>
              <input 
                name="venue" 
                value={formData.venue} 
                onChange={handleChange} 
                type="text" 
                placeholder="e.g. Hyderabad, Secunderabad, etc." 
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Special Instructions & Live Counters</label>
            <textarea 
              name="special_requirements" 
              value={formData.special_requirements} 
              onChange={handleChange} 
              rows="3" 
              placeholder="e.g. Live Dosa / Chaat counters, Banana leaf service, traditional sweets..."
            ></textarea>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            loading={isSubmitting}
            className={styles.submitBtn}
          >
            <Sparkles size={18} /> Submit Quote Request
          </Button>
        </form>
      </div>

      {/* Recap Summary Sidebar */}
      <div className={styles.recapCard}>
        <h3>Quote Summary</h3>
        <ul className={styles.recapList}>
          <li>
            <span>Event Occasion:</span>
            <strong>{eventType}</strong>
          </li>
          <li>
            <span>Estimated Guests:</span>
            <strong>{guests}</strong>
          </li>
          <li>
            <span>Food Preference:</span>
            <strong>{preference}</strong>
          </li>
        </ul>

        <div className={styles.recapNote}>
          <ShieldCheck size={20} className={styles.shieldIcon} />
          <p>You will receive a transparent itemized quotation with zero hidden fees within working hours.</p>
        </div>
      </div>
    </div>
  );
};

/* STEP 5: SUCCESS CONFIRMATION */
export const QuoteSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.successContainer}>
      <div className={styles.successIconBubble}>
        <CheckCircle size={64} className={styles.successIcon} />
      </div>
      <h2>Quote Request Received!</h2>
      <p>Thank you for considering SV Caterers for your special milestone. Our chief event coordinator is reviewing your requirement and will connect on WhatsApp shortly.</p>
      
      <div className={styles.successActions}>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Home
        </Button>
        <Button variant="outline" onClick={() => navigate('/menu')}>
          Explore Menu Dishes
        </Button>
      </div>
    </div>
  );
};
