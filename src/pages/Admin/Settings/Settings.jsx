import React, { useState, useEffect } from 'react';
import useSettingsStore from '../../../store/useSettingsStore';
import { updateSettings } from '../../../services/adminApi';
import { Save } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './Settings.module.scss';

const Settings = () => {
  const { settings: globalSettings, setSettings } = useSettingsStore();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    phone_reservations: '',
    phone_catering: '',
    email: '',
    address: { street: '', city: '', state: '', zip: '' },
    social_media: { facebook: '', instagram: '', twitter: '' }
  });

  useEffect(() => {
    if (globalSettings) {
      setFormData({
        name: globalSettings.name || '',
        tagline: globalSettings.tagline || '',
        description: globalSettings.description || '',
        phone_reservations: globalSettings.phone_reservations || '',
        phone_catering: globalSettings.phone_catering || '',
        email: globalSettings.email || '',
        address: {
          street: globalSettings.address?.street || '',
          city: globalSettings.address?.city || '',
          state: globalSettings.address?.state || '',
          zip: globalSettings.address?.zip || ''
        },
        social_media: {
          facebook: globalSettings.social_media?.facebook || '',
          instagram: globalSettings.social_media?.instagram || '',
          twitter: globalSettings.social_media?.twitter || ''
        }
      });
      setLoading(false);
    }
  }, [globalSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else if (name.startsWith('social_media.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, social_media: { ...prev.social_media, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      // Automatically reflect new changes across the whole app!
      setSettings(formData);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Global Settings</h2>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>General Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Restaurant Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleInputChange} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Contact Details</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Reservations Phone</label>
                <input type="text" name="phone_reservations" value={formData.phone_reservations} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Catering Phone</label>
                <input type="text" name="phone_catering" value={formData.phone_catering} onChange={handleInputChange} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Address</h3>
            <div className={styles.formGroup}>
              <label>Street Address</label>
              <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} />
            </div>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label>City</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label>State</label>
                <input type="text" name="address.state" value={formData.address.state} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label>ZIP Code</label>
                <input type="text" name="address.zip" value={formData.address.zip} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Social Media Links</h3>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label>Facebook</label>
                <input type="url" name="social_media.facebook" value={formData.social_media.facebook} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Instagram</label>
                <input type="url" name="social_media.instagram" value={formData.social_media.instagram} onChange={handleInputChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Twitter</label>
                <input type="url" name="social_media.twitter" value={formData.social_media.twitter} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button type="submit" size="large">
              <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
