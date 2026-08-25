import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/api';
import { createCategory, updateCategory, deleteCategory } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './CategoriesList.module.scss';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const initialFormState = {
    name: '',
    description: '',
    image_url: '',
    is_active: true
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({
        name: cat.name || '',
        description: cat.description || '',
        image_url: cat.image_url || '',
        is_active: cat.is_active !== false // default true
      });
    } else {
      setEditingCat(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCat(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, formData);
      } else {
        await createCategory(formData);
      }
      handleCloseModal();
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All menu items linked to it might be affected.')) {
      try {
        await deleteCategory(id);
        fetchData(); // Refresh list
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Categories</h2>
        <Button onClick={() => handleOpenModal()} className={styles.addBtn}>
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div className={styles.catName}>
                    {cat.image_url && <img src={cat.image_url} alt={cat.name} className={styles.catImage} />}
                    <span>{cat.name}</span>
                  </div>
                </td>
                <td>{cat.description || '-'}</td>
                <td>
                  <span className={`${styles.badge} ${cat.is_active !== false ? styles.active : styles.inactive}`}>
                    {cat.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleOpenModal(cat)}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingCat ? 'Edit Category' : 'Add Category'}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
              </div>

              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
              </div>

              <div className={styles.formGroupCheckbox}>
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                <label htmlFor="is_active">Active (Visible to users)</label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">{editingCat ? 'Save Changes' : 'Create Category'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
