import React, { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../../../services/api';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/adminApi';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './MenuItemsList.module.scss';

const MenuItemsList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    type: 'veg',
    category_id: '',
    isFeatured: false,
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
      setItems(fetchedItems);
      setCategories(fetchedCats);
    } catch (err) {
      console.error('Failed to fetch data:', err);
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
        category_id: item.category_id || '',
        isFeatured: item.isFeatured || false,
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ ...initialFormState, category_id: categories[0]?.id || '' });
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
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        category_id: Number(formData.category_id)
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, payload);
      } else {
        await createMenuItem(payload);
      }
      
      handleCloseModal();
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
        fetchData(); // Refresh list
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Loading menu items...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Menu Items</h2>
        <Button onClick={() => handleOpenModal()} className={styles.addBtn}>
          <Plus size={18} /> Add New Item
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const category = categories.find(c => c.id === item.category_id);
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.itemName}>
                      {item.image_url && <img src={item.image_url} alt={item.name} className={styles.itemImage} />}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{category ? category.name : 'Unknown'}</td>
                  <td>
                    <span className={`${styles.badge} ${item.type === 'veg' ? styles.veg : styles.nonVeg}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>₹{item.price}</td>
                  <td>{item.isFeatured ? 'Yes' : 'No'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button className={styles.closeBtn} onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} />
                <label htmlFor="isFeatured">Feature on Home Page</label>
              </div>

              <div className={styles.modalFooter}>
                <Button variant="outline" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">{editingItem ? 'Save Changes' : 'Create Item'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemsList;
