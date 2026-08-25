import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSingleCateringService } from '../../../services/api';
import { 
  updateServiceBasicInfo, 
  updateServiceBenefits, 
  updateServiceMenuOptions 
} from '../../../services/adminApi';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import toast from 'react-hot-toast';
import styles from './ServiceDetail.module.scss';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  
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

  // Basic Info Handlers
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const saveBasicInfo = async (e) => {
    e.preventDefault();
    try {
      await updateServiceBasicInfo(id, basicInfo);
      toast.success('Basic information updated successfully');
    } catch (err) {
      toast.error('Failed to update basic information');
    }
  };

  // Array Handlers
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
    try {
      const cleanBenefits = benefits.filter(b => typeof b === 'string' && b.trim() !== '');
      await updateServiceBenefits(id, cleanBenefits);
      setBenefits(cleanBenefits.length ? cleanBenefits : ['']);
      toast.success('Benefits updated successfully');
    } catch (err) {
      toast.error('Failed to update benefits');
    }
  };

  const saveMenuOptions = async () => {
    try {
      const cleanOptions = menuOptions.filter(m => typeof m === 'string' && m.trim() !== '');
      await updateServiceMenuOptions(id, cleanOptions);
      setMenuOptions(cleanOptions.length ? cleanOptions : ['']);
      toast.success('Menu options updated successfully');
    } catch (err) {
      toast.error('Failed to update menu options');
    }
  };

  if (loading) return <div>Loading service details...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/admin/services')}>
          <ArrowLeft size={20} />
        </button>
        <h2>Editing Service: {basicInfo.name || id}</h2>
      </div>

      {/* Basic Info Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Basic Information</h3>
          <Button type="submit" form="basicInfoForm">
            <Save size={16} /> Save Info
          </Button>
        </div>
        
        <form id="basicInfoForm" onSubmit={saveBasicInfo} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Service Name</label>
              <input 
                type="text" 
                name="name" 
                value={basicInfo.name} 
                onChange={handleBasicInfoChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Capacity</label>
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
              <label>URL Path</label>
              <input 
                type="text" 
                name="path" 
                value={basicInfo.path} 
                onChange={handleBasicInfoChange} 
                placeholder="e.g. /catering/wedding"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input 
                type="url" 
                name="image_url" 
                value={basicInfo.image_url} 
                onChange={handleBasicInfoChange} 
                placeholder="https://..."
              />
            </div>
          </div>
        </form>
      </div>

      {/* Benefits Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Benefits & Features</h3>
            <p className={styles.arrayHeader}>List the key offerings for this service package</p>
          </div>
          <Button onClick={saveBenefits}>
            <Save size={16} /> Save Benefits
          </Button>
        </div>
        
        <div className={styles.arraySection}>
          {benefits.map((benefit, index) => (
            <div key={`benefit-${index}`} className={styles.arrayItem}>
              <input 
                type="text" 
                value={benefit} 
                onChange={(e) => handleArrayChange(setBenefits, index, e.target.value)} 
                placeholder="e.g. Premium table setup"
              />
              <button type="button" className={styles.removeArrayBtn} onClick={() => removeArrayItem(setBenefits, index)}>
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" className={styles.addArrayBtn} onClick={() => addArrayItem(setBenefits)}>
            <Plus size={16} /> Add Benefit
          </button>
        </div>
      </div>

      {/* Menu Options Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Available Menu Types</h3>
            <p className={styles.arrayHeader}>Define the high-level menu categories available</p>
          </div>
          <Button onClick={saveMenuOptions}>
            <Save size={16} /> Save Menus
          </Button>
        </div>
        
        <div className={styles.arraySection}>
          {menuOptions.map((menu, index) => (
            <div key={`menu-${index}`} className={styles.arrayItem}>
              <input 
                type="text" 
                value={menu} 
                onChange={(e) => handleArrayChange(setMenuOptions, index, e.target.value)} 
                placeholder="e.g. Traditional South Indian"
              />
              <button type="button" className={styles.removeArrayBtn} onClick={() => removeArrayItem(setMenuOptions, index)}>
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" className={styles.addArrayBtn} onClick={() => addArrayItem(setMenuOptions)}>
            <Plus size={16} /> Add Menu Option
          </button>
        </div>
      </div>

    </div>
  );
};

export default ServiceDetail;
