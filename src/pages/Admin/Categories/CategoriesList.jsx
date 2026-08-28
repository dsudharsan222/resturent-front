import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/api';
import { createCategory, updateCategory, deleteCategory } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X, Search, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './CategoriesList.module.scss';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      toast.error('Failed to load categories');
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
        is_active: cat.is_active !== false
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
    setIsSubmitting(true);
    try {
      if (editingCat) {
        await updateCategory(editingCat.id, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? Dishes assigned to this category will be affected.`)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted.');
        fetchData();
      } catch (err) {
        toast.error(err.message || 'Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    return !query || 
      c.name.toLowerCase().includes(query) || 
      (c.description && c.description.toLowerCase().includes(query));
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Category Management</h2>
          <p>Organize your menu sections and catering courses.</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className={styles.controlsBar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonTable}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
          ))}
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className={styles.catName}>
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className={styles.catImg} />
                      ) : (
                        <div className={styles.placeholderImg}>📂</div>
                      )}
                      <strong>{cat.name}</strong>
                    </div>
                  </td>
                  <td>{cat.description || <span className={styles.muted}>No description</span>}</td>
                  <td>
                    <span className={clsx(styles.badge, cat.is_active !== false ? styles.active : styles.inactive)}>
                      {cat.is_active !== false ? (
                        <><CheckCircle2 size={13} /> Active</>
                      ) : (
                        <><XCircle size={13} /> Hidden</>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn} onClick={() => handleOpenModal(cat)} title="Edit Category">
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.name)} title="Delete Category">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="4" className={styles.emptyTd}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingCat ? 'Edit Category' : 'Create New Category'}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Category Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. South Indian Tiffins"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="3" 
                  placeholder="Brief overview of dishes in this section..."
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

              <div className={styles.formGroupCheckbox}>
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active" 
                  checked={formData.is_active} 
                  onChange={handleInputChange} 
                />
                <label htmlFor="is_active">Visible on Menu & Public Browsing</label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
