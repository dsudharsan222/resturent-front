import React, { useState } from 'react';
import useSettingsStore from '../store/useSettingsStore';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Button from '../components/UI/Button';
import styles from './Contact.module.scss';
import toast from 'react-hot-toast';

const Contact = () => {
  const { settings: data } = useSettingsStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'catering',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Thank you! Your message has been received. We will get back to you shortly.');
    }, 600);
  };

  const restaurantName = data?.name || 'SV Caterers Sri Varsha';
  const reservationsPhone = data?.phone_reservations || '+91 90000 12345';
  const cateringPhone = data?.phone_catering || '+91 90000 54321';
  const email = data?.email || 'hello@svcaterers.com';
  const street = data?.address?.street || 'Main Road';
  const city = data?.address?.city || 'Hyderabad';
  const state = data?.address?.state || 'Telangana';
  const zip = data?.address?.zip || '500001';
  const timings = data?.timings || '9:00 AM - 10:00 PM';

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerBadge}>
            <MessageSquare size={14} /> We'd Love to Hear From You
          </div>
          <h1 className={styles.title}>Contact & Event Inquiries</h1>
          <p className={styles.subtitle}>
            Reach out for table reservations, custom event packages, menu consultations, or feedback.
          </p>
        </div>
      </div>

      <div className={`container section-padding ${styles.contentGrid}`}>
        {/* Contact Information Cards */}
        <div className={styles.contactInfoCol}>
          <div className={styles.infoCard}>
            <h2>Get in Touch Directly</h2>
            <p className={styles.infoDesc}>
              Whether you are planning an elaborate wedding banquet or want to book an intimate family dining table, our hospitality team is available to assist you.
            </p>
            
            <ul className={styles.infoList}>
              <li>
                <div className={styles.iconCircle}><Phone size={20} /></div>
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <p>Event Catering: <a href={`tel:${cateringPhone}`}>{cateringPhone}</a></p>
                  <p>Reservations: <a href={`tel:${reservationsPhone}`}>{reservationsPhone}</a></p>
                </div>
              </li>

              <li>
                <div className={styles.iconCircle}><Mail size={20} /></div>
                <div>
                  <strong>Email Address</strong>
                  <p><a href={`mailto:${email}`}>{email}</a></p>
                </div>
              </li>

              <li>
                <div className={styles.iconCircle}><MapPin size={20} /></div>
                <div>
                  <strong>Restaurant & Kitchen Location</strong>
                  <p>{street}, {city}, {state} - {zip}</p>
                </div>
              </li>

              <li>
                <div className={styles.iconCircle}><Clock size={20} /></div>
                <div>
                  <strong>Operating Hours</strong>
                  <p>{timings} (Open All 7 Days)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Send Message Form */}
        <div className={styles.formCol}>
          <div className={styles.formCard}>
            {isSubmitted ? (
              <div className={styles.successState}>
                <CheckCircle2 size={54} color="var(--color-success)" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you, {formData.name}. Our manager will review your inquiry and respond within 24 hours.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'catering', message: '' });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2>Send Us a Message</h2>
                <p className={styles.formDesc}>Drop your query and we'll reply via WhatsApp or Phone promptly.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="e.g. Priya Reddy" 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="priya@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Inquiry Topic *</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required>
                        <option value="catering">Event Catering Inquiry</option>
                        <option value="reservation">Table Reservation</option>
                        <option value="tasting">Menu Tasting Request</option>
                        <option value="feedback">General Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Your Message / Requirements *</label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      required 
                      placeholder="Tell us about your event date, headcount, favorite dishes or specific questions..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="large" 
                    loading={isSubmitting}
                    className={styles.submitBtn}
                  >
                    <Send size={18} /> Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
