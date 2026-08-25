import React, { useState } from 'react';
import Button from './Button';
import { Calendar, ChevronDown } from 'lucide-react';
import styles from './EnquiryForm.module.scss';

const EnquiryForm = ({ predefinedEvent = "", onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vegPref, setVegPref] = useState('');
  const [serviceStyle, setServiceStyle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }, 1500);
  };

  const getEventName = () => {
    if (!predefinedEvent) return "Catering";
    // Convert e.g., 'corporate' to 'Corporate'
    return predefinedEvent.charAt(0).toUpperCase() + predefinedEvent.slice(1);
  };

  const eventName = getEventName();

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.badge}>
          <span className={styles.dot}></span> CATERING ENQUIRY
        </div>
        <h2>Get a {eventName} quote</h2>
        <p className={styles.subtitle}>
          We reply on WhatsApp within working hours. Veg menus from 420 plus GST. 36-hour minimum lead time.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">YOUR NAME</label>
          <input type="text" id="name" required placeholder="Full name" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">PHONE NUMBER (WHATSAPP)</label>
          <div className={styles.phoneInput}>
            <div className={styles.prefix}>+91</div>
            <input type="tel" id="phone" required placeholder="10-digit mobile" pattern="[0-9]{10}" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="date">EVENT DATE</label>
            <div className={styles.selectWrapper}>
              <input type="text" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)} id="date" required placeholder="mm/dd/yyyy" />
              <Calendar className={styles.inputIcon} size={16} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">EVENT TIME</label>
            <div className={styles.selectWrapper}>
              <select id="time" required defaultValue="">
                <option value="" disabled>Select time</option>
                <option value="morning">Morning (Breakfast)</option>
                <option value="afternoon">Afternoon (Lunch)</option>
                <option value="evening">Evening (Dinner)</option>
              </select>
              <ChevronDown className={styles.inputIcon} size={16} />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="guests">HEADCOUNT</label>
          <div className={styles.selectWrapper}>
            <select id="guests" required defaultValue="" onChange={(e) => {
              if (e.target.value === 'other') {
                document.getElementById('exactGuestsWrapper').style.display = 'block';
                document.getElementById('exactGuests').setAttribute('required', 'true');
              } else {
                document.getElementById('exactGuestsWrapper').style.display = 'none';
                document.getElementById('exactGuests').removeAttribute('required');
              }
            }}>
              <option value="" disabled>How many guests?</option>
              <option value="50-100">50 - 100</option>
              <option value="100-300">100 - 300</option>
              <option value="300-500">300 - 500</option>
              <option value="500+">500+</option>
              <option value="other">Other (Enter exact number)</option>
            </select>
            <ChevronDown className={styles.inputIcon} size={16} />
          </div>
          <div id="exactGuestsWrapper" style={{ display: 'none', marginTop: '0.5rem' }}>
            <input type="number" id="exactGuests" placeholder="Enter exact number of guests" min="1" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>VEG OR NON-VEG</label>
          <div className={styles.radioGrid}>
            <label className={`${styles.radioBox} ${vegPref === 'veg' ? styles.active : ''}`}>
              <input type="radio" name="vegPref" value="veg" required onChange={(e) => setVegPref(e.target.value)} />
              <span className={styles.vegIcon}></span> Veg
            </label>
            <label className={`${styles.radioBox} ${vegPref === 'non-veg' ? styles.active : ''}`}>
              <input type="radio" name="vegPref" value="non-veg" onChange={(e) => setVegPref(e.target.value)} />
              <span className={styles.nonVegIcon}></span> Non-Veg
            </label>
            <label className={`${styles.radioBox} ${vegPref === 'both' ? styles.active : ''}`}>
              <input type="radio" name="vegPref" value="both" onChange={(e) => setVegPref(e.target.value)} />
              <div className={styles.bothIcons}>
                <span className={styles.vegIcon}></span>
                <span className={styles.nonVegIcon}></span>
              </div>
               Both
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>SERVICE STYLE (OPTIONAL)</label>
          <div className={styles.radioGrid}>
            <label className={`${styles.radioBox} ${serviceStyle === 'banti' ? styles.active : ''}`}>
              <input type="radio" name="serviceStyle" value="banti" onChange={(e) => setServiceStyle(e.target.value)} />
              Banti Bhojanam
            </label>
            <label className={`${styles.radioBox} ${serviceStyle === 'buffet' ? styles.active : ''}`}>
              <input type="radio" name="serviceStyle" value="buffet" onChange={(e) => setServiceStyle(e.target.value)} />
              Buffet
            </label>
            <label className={`${styles.radioBox} ${serviceStyle === 'plated' ? styles.active : ''}`}>
              <input type="radio" name="serviceStyle" value="plated" onChange={(e) => setServiceStyle(e.target.value)} />
              Plated
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">DELIVERY LOCATION</label>
          <input type="text" id="location" required placeholder="Search your address" />
          <span className={styles.helperText}>Type your locality, building, or pincode.</span>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">SPECIAL REQUESTS (OPTIONAL)</label>
          <textarea id="notes" rows="3" placeholder="Custom dishes, dietary restrictions, anything else."></textarea>
        </div>

        <Button type="submit" size="large" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : `Send my ${eventName} enquiry →`}
        </Button>
        
        <p className={styles.footerText}>
          Final price varies based on headcount and menu selection. Submitting agrees to be contacted by SV Caterers on WhatsApp or phone.
        </p>
      </form>
    </div>
  );
};

export default EnquiryForm;
