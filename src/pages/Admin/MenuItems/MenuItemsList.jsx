import React, { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../../../services/api';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X, Search, UtensilsCrossed, Star } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './MenuItemsList.module.scss';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const MenuItemsList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    type: 'veg',
    category_id: '',
    is_featured: false,
    image_url: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedItems, fetchedCats] = await Promise.all([
        getMenuItems(),
        getCategories()
      ]);
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
      setCategories(Array.isArray(fetchedCats) ? fetchedCats : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        type: item.type || 'veg',
        category_id: item.category_id || (item.category?.id || ''),
        is_featured: item.is_featured || item.isFeatured || false,
        image_url: item.image_url || item.image || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ 
        ...initialFormState, 
        category_id: categories[0]?.id || '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
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
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        category_id: Number(formData.category_id),
        is_featured: formData.is_featured,
        image_url: formData.image_url
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
        toast.success('Dish updated successfully!');
      } else {
        await createMenuItem(payload);
        toast.success('Dish added to menu successfully!');
      }
      
      handleCloseModal();
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      try {
        await deleteMenuItem(id);
        toast.success('Dish deleted.');
        fetchData();
      } catch (err) {
        toast.error(err.message || 'Failed to delete item.');
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));

    const itemCatId = String(item.category_id || item.category?.id || '');
    const matchesCat = categoryFilter === 'all' || itemCatId === String(categoryFilter);

    return matchesSearch && matchesCat;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Menu Management</h2>
          <p>Create, update, and manage all dishes available across dining & catering.</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary">
          <Plus size={18} /> Add New Dish
        </Button>
      </div>

      {/* Filter Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by dish name or ingredients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categorySelectWrap}>
          <label>Filter Category:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories ({items.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.skeletonTable}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
          ))}
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dish Details</th>
                <th>Category</th>
                <th>Dietary Type</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const category = categories.find(c => String(c.id) === String(item.category_id || item.category?.id));
                const price = parseFloat(item.price) || 0;
                const isFeatured = item.is_featured || item.isFeatured;

                return (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.dishCell}>
                        {item.image_url || item.image ? (
                          <img src={item.image_url || item.image} alt={item.name} className={styles.dishImg} />
                        ) : (
                          <div className={styles.dishPlaceholder}>🍲</div>
                        )}
                        <div className={styles.dishInfo}>
                          <strong>{item.name}</strong>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>
                        {category ? category.name : 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={clsx(styles.badge, item.type === 'veg' ? styles.veg : styles.nonVeg)}>
                        <span className={styles.dot}></span>
                        {item.type === 'veg' ? 'Pure Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.priceTag}>₹{price.toFixed(0)}</span>
                    </td>
                    <td>
                      {isFeatured ? (
                        <span className={styles.featuredYes}>★ Yes</span>
                      ) : (
                        <span className={styles.featuredNo}>No</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button 
                          className={styles.editBtn} 
                          onClick={() => handleOpenModal(item)}
                          title="Edit Dish"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className={styles.deleteBtn} 
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete Dish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.emptyTd}>
                    No menu items match your search or filter.
                  </td>
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
              <h3>{editingItem ? 'Edit Dish Details' : 'Add New Menu Item'}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Dish Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Hyderabadi Mutton Biryani"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                    min="0"
                    placeholder="e.g. 350"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Dietary Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="veg">Pure Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Category *</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows="3" 
                  placeholder="Key ingredients, flavor profile, preparation note..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image URL (Unsplash or Hosted Image)</label>
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
                  id="is_featured" 
                  name="is_featured" 
                  checked={formData.is_featured} 
                  onChange={handleInputChange} 
                />
                <label htmlFor="is_featured">Feature this dish on the Home Page highlights</label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemsList;
