import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCateringServices } from '../../../services/api';
import { createService, updateService, deleteService } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X, ListPlus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './ServicesList.module.scss';

const ServicesList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setServices(data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
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
    if (newArray.length === 0) newArray.push(''); // Ensure at least one input remains
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up arrays: remove empty strings
      const payload = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        menu_options: formData.menu_options.filter(m => m.trim() !== '')
      };

      await createService(payload);
      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this catering service?')) {
      try {
        await deleteService(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading Catering Services...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Catering Services</h2>
        <Button onClick={() => handleOpenModal()} className={styles.addBtn}>
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Capacity</th>
              <th>Benefits</th>
              <th>Menu Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(srv => (
              <tr key={srv.id}>
                <td>
                  <div className={styles.srvName}>
                    {srv.image_url && <img src={srv.image_url} alt={srv.name} className={styles.srvImage} />}
                    <div>
                      <strong>{srv.name}</strong>
                      <span className={styles.srvId}>({srv.id})</span>
                    </div>
                  </div>
                </td>
                <td>{srv.capacity || '-'}</td>
                <td>{srv.benefits?.length || 0} items</td>
                <td>{srv.menu_options?.length || 0} items</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => navigate(`/admin/services/${srv.id}`)}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(srv.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No catering services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add Catering Service</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <form id="serviceForm" onSubmit={handleSubmit} className={styles.form}>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ID (Unique lowercase identifier)</label>
                    <input 
                      type="text" 
                      name="id" 
                      value={formData.id} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. wedding"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. Wedding Catering"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Capacity</label>
                    <input 
                      type="text" 
                      name="capacity" 
                      value={formData.capacity} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 50-1000 Guests"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>URL Path (Optional)</label>
                    <input 
                      type="text" 
                      name="path" 
                      value={formData.path} 
                      onChange={handleInputChange} 
                      placeholder="e.g. /catering/wedding"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
                </div>

                <hr className={styles.divider} />

                {/* Benefits Array */}
                <div className={styles.arraySection}>
                  <div className={styles.arrayHeader}>
                    <label>Benefits & Features</label>
                    <button type="button" className={styles.addArrayBtn} onClick={() => handleAddArrayItem('benefits')}>
                      <ListPlus size={16} /> Add Benefit
                    </button>
                  </div>
                  {formData.benefits.map((benefit, index) => (
                    <div key={`benefit-${index}`} className={styles.arrayItem}>
                      <input 
                        type="text" 
                        value={benefit} 
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)} 
                        placeholder="e.g. Premium table setup"
                      />
                      <button type="button" className={styles.removeArrayBtn} onClick={() => handleRemoveArrayItem('benefits', index)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <hr className={styles.divider} />

                {/* Menu Options Array */}
                <div className={styles.arraySection}>
                  <div className={styles.arrayHeader}>
                    <label>Available Menu Types</label>
                    <button type="button" className={styles.addArrayBtn} onClick={() => handleAddArrayItem('menu_options')}>
                      <ListPlus size={16} /> Add Menu Option
                    </button>
                  </div>
                  {formData.menu_options.map((menu, index) => (
                    <div key={`menu-${index}`} className={styles.arrayItem}>
                      <input 
                        type="text" 
                        value={menu} 
                        onChange={(e) => handleArrayChange('menu_options', index, e.target.value)} 
                        placeholder="e.g. Traditional South Indian"
                      />
                      <button type="button" className={styles.removeArrayBtn} onClick={() => handleRemoveArrayItem('menu_options', index)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

              </form>
            </div>
            
            <div className={styles.modalFooter}>
              <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" form="serviceForm">Create Service</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
