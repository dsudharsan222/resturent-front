import React, { useState, useEffect } from 'react';
import { getQuoteData } from '../../../services/api';
import { 
  addQuoteConfigItem, 
  updateQuoteConfigItem, 
  deleteQuoteConfigItem 
} from '../../../services/adminApi';
import { Plus, Edit2, Trash2, Check, X, Users, Utensils } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './QuoteConfigs.module.scss';
import toast from 'react-hot-toast';

const ConfigSection = ({ title, icon, type, items, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ id: '', name: '' });
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.id || !newItem.name) {
      toast.error('Both Identifier ID and Display Name are required');
      return;
    }
    try {
      await addQuoteConfigItem(type, newItem);
      toast.success(`${title} option added!`);
      setNewItem({ id: '', name: '' });
      setIsAdding(false);
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to add option');
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateQuoteConfigItem(type, id, { name: editName });
      toast.success('Option updated.');
      setEditingId(null);
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to update option');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete option "${name}"?`)) {
      try {
        await deleteQuoteConfigItem(type, id);
        toast.success('Option removed.');
        onRefresh();
      } catch (err) {
        toast.error(err.message || 'Failed to delete option');
      }
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <div className={styles.iconWrap}>{icon}</div>
          <div>
            <h3>{title}</h3>
            <span>Master options for the customer quote estimator</span>
          </div>
        </div>
        {!isAdding && (
          <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
            <Plus size={15} /> Add Option
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <div className={styles.formRow}>
            <input 
              type="text" 
              placeholder="Slug ID (e.g. 50-100)" 
              value={newItem.id} 
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
              required 
            />
            <input 
              type="text" 
              placeholder="Display Name (e.g. 50 to 100 Guests)" 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required 
            />
          </div>
          <div className={styles.formActions}>
            <Button variant="ghost" size="small" type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="small" type="submit">
              Save Option
            </Button>
          </div>
        </form>
      )}

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemRow}>
            {editingId === item.id ? (
              <div className={styles.editRow}>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  autoFocus 
                />
                <button className={styles.saveBtn} onClick={() => handleSaveEdit(item.id)}>
                  <Check size={16} />
                </button>
                <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.itemInfo}>
                  <strong>{item.name}</strong>
                  <span className={styles.itemId}>ID: {item.id}</span>
                </div>
                <div className={styles.itemActions}>
                  <button className={styles.actionBtn} onClick={() => handleStartEdit(item)}>
                    <Edit2 size={15} />
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(item.id, item.name)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className={styles.emptyText}>No options configured yet.</div>
        )}
      </div>
    </div>
  );
};

const QuoteConfigs = () => {
  const [config, setConfig] = useState({ guestCounts: [], foodPreferences: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await getQuoteData();
      setConfig({
        guestCounts: Array.isArray(data.guestCounts) ? data.guestCounts : [],
        foodPreferences: Array.isArray(data.foodPreferences) ? data.foodPreferences : []
      });
    } catch (err) {
      console.error('Failed to fetch quote configs:', err);
      toast.error('Failed to load quote settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Quote Wizard Master Data</h2>
          <p>Configure guest count ranges and food preference options presented in the quote wizard.</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.skeletonGrid}>
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }}></div>
        </div>
      ) : (
        <div className={styles.grid}>
          <ConfigSection 
            title="Guest Count Tiers" 
            icon={<Users size={20} />} 
            type="guestCounts" 
            items={config.guestCounts} 
            onRefresh={fetchConfig} 
          />

          <ConfigSection 
            title="Dietary / Food Preferences" 
            icon={<Utensils size={20} />} 
            type="foodPreferences" 
            items={config.foodPreferences} 
            onRefresh={fetchConfig} 
          />
        </div>
      )}
    </div>
  );
};

export default QuoteConfigs;
