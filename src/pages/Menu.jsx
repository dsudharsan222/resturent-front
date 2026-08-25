import React, { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../services/api';
import CategoryTabs from '../components/Menu/CategoryTabs';
import FoodCard from '../components/UI/FoodCard';
import FoodDetailPopup from '../components/Menu/FoodDetailPopup';
import styles from './Menu.module.scss';
import { Search, AlertCircle } from 'lucide-react';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const [cats, items] = await Promise.all([
          getCategories(),
          getMenuItems()
        ]);
        setCategories(cats);
        setMenuItems(items);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load menu data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.menuPage}>
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>Our Menu</h1>
          <p className={styles.subtitle}>Explore our authentic culinary offerings</p>
        </div>
      </div>

      <div className={`container section-padding`}>
        {loading && <div className="text-center" style={{ padding: '40px' }}>Loading...</div>}
        
        {error && (
          <div className="text-center" style={{ padding: '40px', color: 'var(--color-danger)' }}>
            <AlertCircle size={48} style={{ margin: '0 auto', marginBottom: '1rem' }} />
            <h2>Failed to load menu</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className={styles.controls}>
              <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  type="text" 
                  placeholder="Search dishes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CategoryTabs 
                categories={categories} 
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
              />
            </div>

            <div className={styles.menuGrid}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <FoodCard key={item.id} item={item} onViewDetails={setSelectedFood} />
                ))
              ) : (
                <div className={styles.noResults}>
                  <p>No dishes found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedFood && (
        <FoodDetailPopup item={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default Menu;
