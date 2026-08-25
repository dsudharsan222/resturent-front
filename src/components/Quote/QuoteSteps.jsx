import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuoteData, submitQuoteRequest, getCateringServices } from '../../services/api';
import styles from './QuoteSteps.module.scss';
import Button from '../UI/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

const useQuoteConfig = (configKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const config = await getQuoteData();
        setData(config[configKey] || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load options.');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, [configKey]);

  return { data, loading, error };
};

export const StepEventType = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getCateringServices();
        if (data && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        setError('Failed to load catering services.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelect = (id) => {
    navigate(`/catering/quote/${id}`);
  };

  return (
    <div className={styles.stepContainer}>
      <h2>What type of event are you planning?</h2>
      <p>Select the option that best describes your occasion.</p>
      
      {loading && <p>Loading options...</p>}
      {error && <p style={{ color: 'var(--color-danger)' }}><AlertCircle size={16} style={{ verticalAlign: 'middle' }} /> {error}</p>}
      
      {!loading && !error && (
        <div className={styles.optionsGrid}>
          {events.map(event => (
            <button 
              key={event.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(event.id)}
            >
              {event.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
    if (exactGuests && parseInt(exactGuests) > 0) {
      navigate(`/catering/quote/${eventType}/${exactGuests}`);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h2>How many guests are you expecting?</h2>
      <p>This helps us recommend the best service style and menu depth.</p>
      
      {loading && <p>Loading options...</p>}
      {error && <p style={{ color: 'var(--color-danger)' }}><AlertCircle size={16} style={{ verticalAlign: 'middle' }} /> {error}</p>}
      
      {!loading && !error && !showOther && (
        <div className={styles.optionsGrid}>
          {guests.map(guest => (
            <button 
              key={guest.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(guest.id)}
            >
              {guest.name} Guests
            </button>
          ))}
          <button 
            className={styles.optionCard}
            onClick={() => setShowOther(true)}
          >
            Other / Custom Number
          </button>
        </div>
      )}

      {showOther && (
        <div style={{ marginTop: '1.5rem' }}>
          <input 
            type="number" 
            placeholder="Enter exact number of guests (e.g., 250)" 
            min="1" 
            value={exactGuests}
            onChange={(e) => setExactGuests(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '2px solid var(--color-gray-200)', 
              borderRadius: '8px', 
              marginBottom: '1.5rem', 
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => setShowOther(false)} style={{ flex: 1, backgroundColor: 'var(--color-gray-100)', color: 'var(--color-gray-800)' }}>Back</Button>
            <Button onClick={handleNextExact} style={{ flex: 1 }} disabled={!exactGuests || parseInt(exactGuests) < 1}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const StepPreference = () => {
  const { data: preferences, loading, error } = useQuoteConfig('foodPreferences');
  const { eventType, guests } = useParams();
  const navigate = useNavigate();

  const handleSelect = (id) => {
    navigate(`/catering/quote/${eventType}/${guests}/${id}/contact`);
  };

  return (
    <div className={styles.stepContainer}>
      <h2>What is your food preference?</h2>
      <p>Our kitchens maintain strict separation for pure vegetarian orders.</p>
      
      {loading && <p>Loading options...</p>}
      {error && <p style={{ color: 'var(--color-danger)' }}><AlertCircle size={16} style={{ verticalAlign: 'middle' }} /> {error}</p>}
      
      {!loading && !error && (
        <div className={styles.optionsGrid}>
          {preferences.map(pref => (
            <button 
              key={pref.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(pref.id)}
            >
              {pref.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
    meal_type: '',
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
      customer_email: formData.customer_email,
      event_date: formData.event_date ? new Date(formData.event_date).toISOString() : undefined,
    };

    try {
      await submitQuoteRequest(payload);
      navigate('/catering/quote/success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h2>Final Details</h2>
      <p>You're requesting a quote for a <strong>{preference}</strong> menu for a <strong>{eventType}</strong> with <strong>{guests}</strong> guests.</p>
      
      {error && (
        <div style={{ padding: '1rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input name="customer_name" value={formData.customer_name} onChange={handleChange} type="text" required placeholder="John Doe" />
          </div>
          <div className={styles.formGroup}>
            <label>Mobile Number</label>
            <input name="customer_phone" value={formData.customer_phone} onChange={handleChange} type="tel" required placeholder="+91 90000 00000" />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>WhatsApp Number</label>
            <input type="tel" placeholder="Same as mobile" />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input name="customer_email" value={formData.customer_email} onChange={handleChange} type="email" required placeholder="john@example.com" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Event Date</label>
            <input name="event_date" value={formData.event_date} onChange={handleChange} type="date" required />
          </div>
          <div className={styles.formGroup}>
            <label>Event Time / Meal</label>
            <select name="meal_type" value={formData.meal_type} onChange={handleChange} required>
              <option value="">Select Meal</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="full_day">Full Day</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Event Location / Venue</label>
          <input name="venue" value={formData.venue} onChange={handleChange} type="text" required placeholder="City or Hall Name" />
        </div>

        <div className={styles.formGroup}>
          <label>Special Requirements</label>
          <textarea name="special_requirements" value={formData.special_requirements} onChange={handleChange} rows="4" placeholder="Need live counters, premium menu, traditional serving..."></textarea>
        </div>

        <Button type="submit" size="large" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Request Quote'}
        </Button>
      </form>
    </div>
  );
};

export const QuoteSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.successContainer}>
      <CheckCircle size={80} color="var(--color-success)" className={styles.successIcon} />
      <h2>Quote Request Sent!</h2>
      <p>Thank you for choosing SV Caterers Sri Varsha. Our event managers will review your details and contact you within 24 hours.</p>
      <Button onClick={() => navigate('/')}>Return to Home</Button>
    </div>
  );
};
