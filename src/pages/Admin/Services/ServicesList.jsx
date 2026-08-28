import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCateringServices } from '../../../services/api';
import { createService, deleteService } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X, ListPlus, Users, Eye } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './ServicesList.module.scss';
import toast from 'react-hot-toast';

const ServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    id: '',
    name: '',
    description: '',
    capacity: '',
    image_url: '',
    path: '',
    benefits: [''],
    menu_options: ['']
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCateringServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      toast.error('Failed to load catering services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleRemoveArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    if (newArray.length === 0) newArray.push('');
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        menu_options: formData.menu_options.filter(m => m.trim() !== '')
      };

      await createService(payload);
      toast.success('Catering package created successfully!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to create catering service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete catering package "${name}"?`)) {
      try {
        await deleteService(id);
        toast.success('Service deleted.');
        fetchData();
      } catch (err) {
        toast.error(err.message || 'Failed to delete service');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Catering Services & Event Packages</h2>
          <p>Configure event tiers, custom menu offerings, and guest capacity limits.</p>
        </div>
        <Button onClick={handleOpenModal} variant="primary">
          <Plus size={18} /> Add New Package
        </Button>
      </div>

      {loading ? (
        <div className={styles.skeletonTable}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: '70px', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
          ))}
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Service Name & Identifier</th>
                <th>Guest Capacity</th>
                <th>Features / Benefits</th>
                <th>Menu Styles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((srv) => (
                <tr key={srv.id}>
                  <td>
                    <div className={styles.srvName}>
                      {srv.image_url ? (
                        <img src={srv.image_url} alt={srv.name} className={styles.srvImage} />
                      ) : (
                        <div className={styles.placeholderImg}>🎉</div>
                      )}
                      <div>
                        <strong>{srv.name}</strong>
                        <span className={styles.srvId}>/{srv.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.capacityTag}>
                      <Users size={13} /> {srv.capacity || 'Flexible'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.countTag}>
                      {srv.benefits?.length || 0} features
                    </span>
                  </td>
                  <td>
                    <span className={styles.countTag}>
                      {srv.menu_options?.length || 0} styles
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button 
                        className={styles.editBtn} 
                        onClick={() => navigate(`/admin/services/${srv.id}`)}
                        title="Configure Features & Menus"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(srv.id, srv.name)}
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.emptyTd}>No catering services found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Create New Catering Package</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <form id="serviceForm" onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Unique ID (lowercase slug) *</label>
                    <input 
                      type="text" 
                      name="id" 
                      value={formData.id} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. housewarming"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Package Display Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. Housewarming Pooja Catering"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Package Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="3" 
                    placeholder="Overview of this occasion..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Guest Capacity</label>
                    <input 
                      type="text" 
                      name="capacity" 
                      value={formData.capacity} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 50 - 500 Guests"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Cover Image URL</label>
                    <input 
                      type="url" 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleInputChange} 
                      placeholder="https://images.unsplash.com/..." 
                    />
                  </div>
                </div>

                {/* Benefits List */}
                <div className={styles.arraySection}>
                  <div className={styles.arrayHeader}>
                    <label>Key Features & Service Highlights</label>
                    <button type="button" className={styles.addArrayBtn} onClick={() => handleAddArrayItem('benefits')}>
                      <ListPlus size={15} /> Add Feature
                    </button>
                  </div>
                  {formData.benefits.map((benefit, index) => (
                    <div key={`b-${index}`} className={styles.arrayItem}>
                      <input 
                        type="text" 
                        value={benefit} 
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)} 
                        placeholder="e.g. Live Banana Leaf Serving"
                      />
                      <button type="button" onClick={() => handleRemoveArrayItem('benefits', index)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Menu Options List */}
                <div className={styles.arraySection}>
                  <div className={styles.arrayHeader}>
                    <label>Menu Styles Available</label>
                    <button type="button" className={styles.addArrayBtn} onClick={() => handleAddArrayItem('menu_options')}>
                      <ListPlus size={15} /> Add Menu Style
                    </button>
                  </div>
                  {formData.menu_options.map((menu, index) => (
                    <div key={`m-${index}`} className={styles.arrayItem}>
                      <input 
                        type="text" 
                        value={menu} 
                        onChange={(e) => handleArrayChange('menu_options', index, e.target.value)} 
                        placeholder="e.g. Traditional Sattvic Feast"
                      />
                      <button type="button" onClick={() => handleRemoveArrayItem('menu_options', index)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </form>
            </div>
            
            <div className={styles.modalFooter}>
              <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" form="serviceForm" variant="primary" loading={isSubmitting}>
                Create Package
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
