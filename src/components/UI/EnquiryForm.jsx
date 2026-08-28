import React, { useState } from 'react';
import { Calendar, Users, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitQuoteRequest } from '../../services/api';
import Button from './Button';
import styles from './EnquiryForm.module.scss';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const EnquiryForm = ({ predefinedEvent = "", onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    event_type_id: predefinedEvent || 'wedding',
    guest_count_id: '100-300',
    exact_guests: '',
    food_preference_id: 'both',
    service_style: 'buffet',
    event_date: '',
    meal_type: 'lunch',
    venue: '',
    special_requirements: ''
  });

  const [isCustomGuests, setIsCustomGuests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustomGuests(true);
    } else {
      setIsCustomGuests(false);
      setFormData((prev) => ({ ...prev, guest_count_id: val, exact_guests: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || undefined,
        event_type_id: formData.event_type_id || predefinedEvent || 'catering',
        guest_count_id: isCustomGuests ? formData.exact_guests : formData.guest_count_id,
        food_preference_id: formData.food_preference_id,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : undefined,
      };

      await submitQuoteRequest(payload);
      toast.success('Your catering inquiry has been submitted! Our event manager will contact you promptly.');
      setIsSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('Failed to submit quote inquiry:', err);
      const msg = err.message || 'Failed to submit catering inquiry. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successCard}>
        <CheckCircle2 size={54} className={styles.successIcon} />
        <h3>Inquiry Received!</h3>
        <p>Thank you, {formData.customer_name}. Our event planning specialist will review your request and reach out on WhatsApp/Phone at {formData.customer_phone} within a few hours.</p>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              customer_name: '',
              customer_phone: '',
              customer_email: '',
              event_type_id: predefinedEvent || 'wedding',
              guest_count_id: '100-300',
              exact_guests: '',
              food_preference_id: 'both',
              service_style: 'buffet',
              event_date: '',
              meal_type: 'lunch',
              venue: '',
              special_requirements: ''
            });
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  const eventTitle = predefinedEvent 
    ? (predefinedEvent.charAt(0).toUpperCase() + predefinedEvent.slice(1).replace(/-/g, ' '))
    : 'Catering';

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <span className={styles.badgeTag}>★ Instant Event Quote</span>
        <h2>Request {eventTitle} Quote</h2>
        <p>Fill in your event details below to receive a personalized authentic menu and pricing estimate.</p>
      </div>

      {errorMessage && (
        <div className={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name *</label>
            <input 
              type="text" 
              name="customer_name" 
              required 
              placeholder="e.g. Ramesh Varma"
              value={formData.customer_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone / WhatsApp Number *</label>
            <input 
              type="tel" 
              name="customer_phone" 
              required 
              placeholder="+91 98765 43210"
              value={formData.customer_phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="customer_email" 
              placeholder="ramesh@example.com"
              value={formData.customer_email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Event Date *</label>
            <div className={styles.inputWithIcon}>
              <input 
                type="date" 
                name="event_date" 
                required 
                value={formData.event_date}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Expected Headcount *</label>
            <select 
              value={isCustomGuests ? 'custom' : formData.guest_count_id} 
              onChange={handleGuestSelectChange}
            >
              <option value="50-100">50 - 100 Guests</option>
              <option value="100-300">100 - 300 Guests</option>
              <option value="300-500">300 - 500 Guests</option>
              <option value="500-plus">500+ Guests</option>
              <option value="custom">Custom Number...</option>
            </select>
            {isCustomGuests && (
              <input 
                type="number" 
                name="exact_guests" 
                required 
                min="1" 
                placeholder="Enter exact guest count" 
                className={styles.customGuestsInput}
                value={formData.exact_guests}
                onChange={handleChange}
              />
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Meal Time</label>
            <select name="meal_type" value={formData.meal_type} onChange={handleChange}>
              <option value="breakfast">Morning (Breakfast / Tiffins)</option>
              <option value="lunch">Afternoon (Grand Lunch)</option>
              <option value="dinner">Evening (Dinner / Reception)</option>
              <option value="full_day">Full Day (Multiple Meals)</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Food Preference</label>
          <div className={styles.preferenceGrid}>
            <label className={clsx(styles.prefOption, formData.food_preference_id === 'veg' && styles.active)}>
              <input 
                type="radio" 
                name="food_preference_id" 
                value="veg"
                checked={formData.food_preference_id === 'veg'}
                onChange={handleChange}
              />
              <span className={styles.vegDot}></span>
              <span>Pure Vegetarian</span>
            </label>

            <label className={clsx(styles.prefOption, formData.food_preference_id === 'non-veg' && styles.active)}>
              <input 
                type="radio" 
                name="food_preference_id" 
                value="non-veg"
                checked={formData.food_preference_id === 'non-veg'}
                onChange={handleChange}
              />
              <span className={styles.nonVegDot}></span>
              <span>Non-Vegetarian</span>
            </label>

            <label className={clsx(styles.prefOption, formData.food_preference_id === 'both' && styles.active)}>
              <input 
                type="radio" 
                name="food_preference_id" 
                value="both"
                checked={formData.food_preference_id === 'both'}
                onChange={handleChange}
              />
              <span className={styles.bothDot}></span>
              <span>Both (Veg & Non-Veg)</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Event Venue / Locality</label>
          <input 
            type="text" 
            name="venue" 
            placeholder="e.g. Function Hall name, Jubilee Hills, Hyderabad"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Special Instructions / Custom Menu Wishlist</label>
          <textarea 
            name="special_requirements" 
            rows="3" 
            placeholder="Live counters (Dosa/Chaat), specific dessert items, banana leaf service..."
            value={formData.special_requirements}
            onChange={handleChange}
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="large" 
          loading={isSubmitting}
          className={styles.submitBtn}
        >
          <Send size={18} /> Request Custom Quote
        </Button>
      </form>
    </div>
  );
};

export default EnquiryForm;
