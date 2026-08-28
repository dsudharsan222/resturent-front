import React, { useState, useEffect } from 'react';
import { getSettings } from '../../../services/api';
import { updateSettings } from '../../../services/adminApi';
import useSettingsStore from '../../../store/useSettingsStore';
import { Save, Store, Phone, MapPin, Image as ImageIcon, Share2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './Settings.module.scss';
import toast from 'react-hot-toast';

const Settings = () => {
  const { fetchSettings } = useSettingsStore();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    phone_reservations: '',
    phone_catering: '',
    email: '',
    timings: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    social_media: {
      instagram: '',
      facebook: '',
      twitter: ''
    },
    images: {
      hero: '',
      about: '',
      gallery: []
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      if (data) {
        setFormData({
          name: data.name || '',
          tagline: data.tagline || '',
          description: data.description || '',
          phone_reservations: data.phone_reservations || '',
          phone_catering: data.phone_catering || '',
          email: data.email || '',
          timings: data.timings || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zip: data.address?.zip || ''
          },
          social_media: {
            instagram: data.social_media?.instagram || '',
            facebook: data.social_media?.facebook || '',
            twitter: data.social_media?.twitter || ''
          },
          images: {
            hero: data.images?.hero || '',
            about: data.images?.about || '',
            gallery: Array.isArray(data.images?.gallery) ? data.images.gallery : []
          }
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast.error('Failed to load restaurant settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success('Restaurant settings saved successfully!');
      fetchSettings(); // sync global store
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className="skeleton" style={{ height: '500px', borderRadius: '16px' }}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Global Restaurant Settings</h2>
            <p>Update your brand info, direct contact numbers, address, and imagery.</p>
          </div>
          <Button type="submit" variant="primary" loading={isSaving}>
            <Save size={18} /> Save All Changes
          </Button>
        </div>

        <div className={styles.grid}>
          {/* Card 1: Brand & Tagline */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Store size={20} className={styles.cardIcon} />
              <h3>Brand Identity</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Restaurant / Brand Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleBasicChange} 
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tagline / Motto</label>
              <input 
                type="text" 
                name="tagline" 
                value={formData.tagline} 
                onChange={handleBasicChange} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Brand Story / Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleBasicChange} 
                rows="3" 
              />
            </div>
          </div>

          {/* Card 2: Contact & Operating Hours */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Phone size={20} className={styles.cardIcon} />
              <h3>Contact Details & Timings</h3>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Dining & Reservations Phone</label>
                <input 
                  type="text" 
                  name="phone_reservations" 
                  value={formData.phone_reservations} 
                  onChange={handleBasicChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Catering / WhatsApp Helpline</label>
                <input 
                  type="text" 
                  name="phone_catering" 
                  value={formData.phone_catering} 
                  onChange={handleBasicChange} 
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Support Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleBasicChange} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Operating Hours / Timings</label>
                <input 
                  type="text" 
                  name="timings" 
                  value={formData.timings} 
                  onChange={handleBasicChange} 
                  placeholder="e.g. 9:00 AM - 10:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Address & Location */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <MapPin size={20} className={styles.cardIcon} />
              <h3>Physical Location & Address</h3>
            </div>

            <div className={styles.formGroup}>
              <label>Street Address</label>
              <input 
                type="text" 
                value={formData.address.street} 
                onChange={(e) => handleNestedChange('address', 'street', e.target.value)} 
              />
            </div>

            <div className={styles.formRowThree}>
              <div className={styles.formGroup}>
                <label>City</label>
                <input 
                  type="text" 
                  value={formData.address.city} 
                  onChange={(e) => handleNestedChange('address', 'city', e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>State</label>
                <input 
                  type="text" 
                  value={formData.address.state} 
                  onChange={(e) => handleNestedChange('address', 'state', e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>ZIP / PIN Code</label>
                <input 
                  type="text" 
                  value={formData.address.zip} 
                  onChange={(e) => handleNestedChange('address', 'zip', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Card 4: Brand Imagery */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <ImageIcon size={20} className={styles.cardIcon} />
              <h3>Cover Photos & Visual Assets</h3>
            </div>

            <div className={styles.formGroup}>
              <label>Hero Background Image URL</label>
              <input 
                type="url" 
                value={formData.images.hero} 
                onChange={(e) => handleNestedChange('images', 'hero', e.target.value)} 
                placeholder="https://images.unsplash.com/..." 
              />
            </div>

            <div className={styles.formGroup}>
              <label>About / Kitchen Photo URL</label>
              <input 
                type="url" 
                value={formData.images.about} 
                onChange={(e) => handleNestedChange('images', 'about', e.target.value)} 
                placeholder="https://images.unsplash.com/..." 
              />
            </div>
          </div>

          {/* Card 5: Social Media */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Share2 size={20} className={styles.cardIcon} />
              <h3>Social Media Presence</h3>
            </div>

            <div className={styles.formRowThree}>
              <div className={styles.formGroup}>
                <label>Instagram URL</label>
                <input 
                  type="url" 
                  value={formData.social_media.instagram} 
                  onChange={(e) => handleNestedChange('social_media', 'instagram', e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Facebook URL</label>
                <input 
                  type="url" 
                  value={formData.social_media.facebook} 
                  onChange={(e) => handleNestedChange('social_media', 'facebook', e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Twitter / X URL</label>
                <input 
                  type="url" 
                  value={formData.social_media.twitter} 
                  onChange={(e) => handleNestedChange('social_media', 'twitter', e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerSticky}>
          <Button type="submit" variant="primary" size="large" loading={isSaving}>
            <Save size={18} /> Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
