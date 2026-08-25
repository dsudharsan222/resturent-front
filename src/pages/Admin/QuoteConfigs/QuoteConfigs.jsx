import React, { useState, useEffect } from 'react';
import { getQuoteData } from '../../../services/api';
import { 
  createEventType, deleteEventType,
  createGuestCount, deleteGuestCount,
  createFoodPreference, deleteFoodPreference
} from '../../../services/adminApi';
import { Trash2, Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './QuoteConfigs.module.scss';

const QuoteConfigs = () => {
  const [config, setConfig] = useState({
    eventTypes: [],
    guestCounts: [],
    foodPreferences: []
  });
  const [loading, setLoading] = useState(true);

  // New inputs
  const [newEventId, setNewEventId] = useState('');
  const [newEventName, setNewEventName] = useState('');
  
  const [newGuestId, setNewGuestId] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  
  const [newFoodId, setNewFoodId] = useState('');
  const [newFoodName, setNewFoodName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getQuoteData();
      setConfig({
        eventTypes: data.eventTypes || [],
        guestCounts: data.guestCounts || [],
        foodPreferences: data.foodPreferences || []
      });
    } catch (err) {
      console.error('Failed to fetch quote configs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (type, e) => {
    e.preventDefault();
    try {
      if (type === 'event') {
        if (!newEventId || !newEventName) return;
        await createEventType({ id: newEventId, name: newEventName, is_active: true });
        setNewEventId(''); setNewEventName('');
      } else if (type === 'guest') {
        if (!newGuestId || !newGuestName) return;
        await createGuestCount({ id: newGuestId, name: newGuestName, is_active: true });
        setNewGuestId(''); setNewGuestName('');
      } else if (type === 'food') {
        if (!newFoodId || !newFoodName) return;
        await createFoodPreference({ id: newFoodId, name: newFoodName, is_active: true });
        setNewFoodId(''); setNewFoodName('');
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this configuration option?')) {
      try {
        if (type === 'event') await deleteEventType(id);
        else if (type === 'guest') await deleteGuestCount(id);
        else if (type === 'food') await deleteFoodPreference(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading Quote Configurations...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quote Master Configurations</h2>
        <p>Manage the dropdown options available when users request a catering quote.</p>
      </div>

      <div className={styles.grid}>
        {/* Event Types */}
        <div className={styles.configCard}>
          <h3>Event Types</h3>
          <form className={styles.addForm} onSubmit={(e) => handleAdd('event', e)}>
            <input type="text" placeholder="ID (e.g. wedding)" value={newEventId} onChange={e => setNewEventId(e.target.value)} required />
            <input type="text" placeholder="Name (e.g. Wedding)" value={newEventName} onChange={e => setNewEventName(e.target.value)} required />
            <Button type="submit" size="small"><Plus size={16} /></Button>
          </form>
          <ul className={styles.list}>
            {config.eventTypes.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong> <span className={styles.subid}>({item.id})</span>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete('event', item.id)}><Trash2 size={16}/></button>
              </li>
            ))}
            {config.eventTypes.length === 0 && <li className={styles.empty}>No event types found.</li>}
          </ul>
        </div>

        {/* Guest Counts */}
        <div className={styles.configCard}>
          <h3>Guest Counts</h3>
          <form className={styles.addForm} onSubmit={(e) => handleAdd('guest', e)}>
            <input type="text" placeholder="ID (e.g. 50-100)" value={newGuestId} onChange={e => setNewGuestId(e.target.value)} required />
            <input type="text" placeholder="Name (e.g. 50-100 Guests)" value={newGuestName} onChange={e => setNewGuestName(e.target.value)} required />
            <Button type="submit" size="small"><Plus size={16} /></Button>
          </form>
          <ul className={styles.list}>
            {config.guestCounts.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong> <span className={styles.subid}>({item.id})</span>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete('guest', item.id)}><Trash2 size={16}/></button>
              </li>
            ))}
            {config.guestCounts.length === 0 && <li className={styles.empty}>No guest counts found.</li>}
          </ul>
        </div>

        {/* Food Preferences */}
        <div className={styles.configCard}>
          <h3>Food Preferences</h3>
          <form className={styles.addForm} onSubmit={(e) => handleAdd('food', e)}>
            <input type="text" placeholder="ID (e.g. veg)" value={newFoodId} onChange={e => setNewFoodId(e.target.value)} required />
            <input type="text" placeholder="Name (e.g. Pure Veg)" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} required />
            <Button type="submit" size="small"><Plus size={16} /></Button>
          </form>
          <ul className={styles.list}>
            {config.foodPreferences.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong> <span className={styles.subid}>({item.id})</span>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete('food', item.id)}><Trash2 size={16}/></button>
              </li>
            ))}
            {config.foodPreferences.length === 0 && <li className={styles.empty}>No food preferences found.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfigs;
