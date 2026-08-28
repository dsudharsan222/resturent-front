import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSingleCateringService } from '../../../services/api';
import { 
  updateServiceBasicInfo, 
  updateServiceBenefits, 
  updateServiceMenuOptions 
} from '../../../services/adminApi';
import { ArrowLeft, Save, Plus, X, ListPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../../../components/UI/Button';
import toast from 'react-hot-toast';
import styles from './ServiceDetail.module.scss';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingBenefits, setSavingBenefits] = useState(false);
  const [savingMenus, setSavingMenus] = useState(false);
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    capacity: '',
    path: '',
    image_url: ''
  });
  
  const [benefits, setBenefits] = useState(['']);
  const [menuOptions, setMenuOptions] = useState(['']);

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const data = await getSingleCateringService(id);
      
      setBasicInfo({
        name: data.name || '',
        description: data.description || '',
        capacity: data.capacity || '',
        path: data.path || '',
        image_url: data.image_url || ''
      });
      
      setBenefits(data.benefits?.length ? data.benefits.map(b => typeof b === 'object' ? b.benefit : b) : ['']);
      setMenuOptions(data.menu_options?.length ? data.menu_options.map(m => typeof m === 'object' ? m.menu_option : m) : ['']);
      
    } catch (err) {
      console.error('Failed to fetch service details:', err);
      toast.error('Failed to load service details');
      navigate('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const saveBasicInfo = async (e) => {
    e.preventDefault();
    setSavingBasic(true);
    try {
      await updateServiceBasicInfo(id, basicInfo);
      toast.success('Basic information updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update basic info');
    } finally {
      setSavingBasic(false);
    }
  };

  const handleArrayChange = (setter, index, value) => {
    setter(prev => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const addArrayItem = (setter) => {
    setter(prev => [...prev, '']);
  };

  const removeArrayItem = (setter, index) => {
    setter(prev => {
      const newArray = prev.filter((_, i) => i !== index);
      return newArray.length === 0 ? [''] : newArray;
    });
  };

  const saveBenefits = async () => {
    setSavingBenefits(true);
    try {
      const cleanBenefits = benefits.filter(b => typeof b === 'string' && b.trim() !== '');
      await updateServiceBenefits(id, cleanBenefits);
      setBenefits(cleanBenefits.length ? cleanBenefits : ['']);
      toast.success('Benefits & features updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update benefits');
    } finally {
      setSavingBenefits(false);
    }
  };

  const saveMenuOptions = async () => {
    setSavingMenus(true);
    try {
      const cleanOptions = menuOptions.filter(m => typeof m === 'string' && m.trim() !== '');
      await updateServiceMenuOptions(id, cleanOptions);
      setMenuOptions(cleanOptions.length ? cleanOptions : ['']);
      toast.success('Menu styles updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update menu options');
    } finally {
      setSavingMenus(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/admin/services')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2>Configuring: {basicInfo.name || id}</h2>
            <span className={styles.slugTag}>Slug Identifier: /{id}</span>
          </div>
        </div>

        <Link to={`/catering/${id}`} target="_blank" className={styles.previewBtn}>
          View Public Page →
        </Link>
      </div>

      <div className={styles.grid}>
        {/* Basic Info Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>General Information</h3>
              <p>Display title, guest capacity, and cover photo</p>
            </div>
            <Button type="submit" form="basicInfoForm" variant="primary" size="small" loading={savingBasic}>
              <Save size={16} /> Save Info
            </Button>
          </div>
          
          <form id="basicInfoForm" onSubmit={saveBasicInfo} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Service Display Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={basicInfo.name} 
                  onChange={handleBasicInfoChange} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Guest Capacity</label>
                <input 
                  type="text" 
                  name="capacity" 
                  value={basicInfo.capacity} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. 50-1000 Guests"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea 
                name="description" 
                value={basicInfo.description} 
                onChange={handleBasicInfoChange} 
                rows="3" 
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Public URL Path</label>
                <input 
                  type="text" 
                  name="path" 
                  value={basicInfo.path} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. /catering/wedding"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cover Photo URL</label>
                <input 
                  type="url" 
                  name="image_url" 
                  value={basicInfo.image_url} 
                  onChange={handleBasicInfoChange} 
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Benefits & Features Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Benefits & Key Offerings</h3>
              <p>Bullet points displayed on the catering page</p>
            </div>
            <Button onClick={saveBenefits} variant="primary" size="small" loading={savingBenefits}>
              <Save size={16} /> Save Features
            </Button>
          </div>
          
          <div className={styles.arraySection}>
            {benefits.map((benefit, index) => (
              <div key={`b-${index}`} className={styles.arrayItem}>
                <input 
                  type="text" 
                  value={benefit} 
                  onChange={(e) => handleArrayChange(setBenefits, index, e.target.value)} 
                  placeholder="e.g. Live counters with hand-tossed breads"
                />
                <button type="button" onClick={() => removeArrayItem(setBenefits, index)}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => addArrayItem(setBenefits)}>
              <Plus size={15} /> Add Feature Line
            </button>
          </div>
        </div>

        {/* Menu Styles Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Available Menu Tiers / Styles</h3>
              <p>Categories of dining packages available for this event</p>
            </div>
            <Button onClick={saveMenuOptions} variant="primary" size="small" loading={savingMenus}>
              <Save size={16} /> Save Menus
            </Button>
          </div>
          
          <div className={styles.arraySection}>
            {menuOptions.map((menu, index) => (
              <div key={`m-${index}`} className={styles.arrayItem}>
                <input 
                  type="text" 
                  value={menu} 
                  onChange={(e) => handleArrayChange(setMenuOptions, index, e.target.value)} 
                  placeholder="e.g. Traditional Royal Feast"
                />
                <button type="button" onClick={() => removeArrayItem(setMenuOptions, index)}>
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={() => addArrayItem(setMenuOptions)}>
              <Plus size={15} /> Add Menu Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
