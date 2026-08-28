import React, { useState, useEffect, useMemo } from 'react';
import { getCategories, getMenuItems } from '../services/api';
import CategoryTabs from '../components/Menu/CategoryTabs';
import FoodCard from '../components/UI/FoodCard';
import FoodDetailPopup from '../components/Menu/FoodDetailPopup';
import styles from './Menu.module.scss';
import { Search, AlertCircle, X, Sparkles, Filter, UtensilsCrossed } from 'lucide-react';
import Button from '../components/UI/Button';
import clsx from 'clsx';

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg' | 'featured'
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
        setCategories(Array.isArray(cats) ? cats : []);
        setMenuItems(Array.isArray(items) ? items : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load menu data:', err);
        setError(err.message || 'Failed to load menu data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category Filter
      const matchesCategory = activeCategory === 'all' || 
        String(item.category_id) === String(activeCategory) ||
        (item.category && String(item.category.id) === String(activeCategory));

      // Dietary Filter
      let matchesDiet = true;
      if (dietaryFilter === 'veg') {
        matchesDiet = item.type === 'veg';
      } else if (dietaryFilter === 'non-veg') {
        matchesDiet = item.type === 'non-veg';
      } else if (dietaryFilter === 'featured') {
        matchesDiet = item.is_featured || item.isFeatured;
      }

      // Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query));

      return matchesCategory && matchesDiet && matchesSearch;
    });
  }, [menuItems, activeCategory, dietaryFilter, searchQuery]);

  const activeCategoryObj = categories.find((c) => String(c.id) === String(activeCategory));
  const categoryTitle = activeCategory === 'all' ? 'All Dishes' : (activeCategoryObj?.name || 'Category');
  const categoryDesc = activeCategory === 'all' 
    ? 'Browse our complete authentic culinary selection.' 
    : (activeCategoryObj?.description || '');

  return (
    <div className={styles.menuPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerBadge}>
            <UtensilsCrossed size={14} /> Freshly Prepared Daily
          </div>
          <h1 className={styles.title}>Our Authentic Menu</h1>
          <p className={styles.subtitle}>
            Explore our curated culinary creations, made with hand-pounded spices and generations-old South Indian recipes.
          </p>
        </div>
      </div>

      <div className={`container ${styles.menuContainer}`}>
        {/* Search & Category Filter Controls */}
        <div className={styles.controlsSticky}>
          <div className={styles.searchAndFilters}>
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Search dishes (e.g. Biryani, Idli, Paneer)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dietary Pills */}
            <div className={styles.dietaryPills}>
              <button 
                className={clsx(styles.dietPill, dietaryFilter === 'all' && styles.active)}
                onClick={() => setDietaryFilter('all')}
              >
                All
              </button>
              <button 
                className={clsx(styles.dietPill, styles.vegPill, dietaryFilter === 'veg' && styles.active)}
                onClick={() => setDietaryFilter('veg')}
              >
                <span className={styles.vegDot}></span> Pure Veg
              </button>
              <button 
                className={clsx(styles.dietPill, styles.nonVegPill, dietaryFilter === 'non-veg' && styles.active)}
                onClick={() => setDietaryFilter('non-veg')}
              >
                <span className={styles.nonVegDot}></span> Non-Veg
              </button>
              <button 
                className={clsx(styles.dietPill, styles.featuredPill, dietaryFilter === 'featured' && styles.active)}
                onClick={() => setDietaryFilter('featured')}
              >
                ★ Featured
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryTabsWrapper}>
            <CategoryTabs 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>
        </div>

        {/* Category Description & Item Counter */}
        <div className={styles.categoryInfoBar}>
          <div>
            <h2>{categoryTitle}</h2>
            {categoryDesc && <p>{categoryDesc}</p>}
          </div>
          <span className={styles.resultsCount}>
            {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} available
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className={styles.menuGrid}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton-card">
                <div className="skeleton skeleton-img"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <h2>Unable to load menu</h2>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Retry Loading
            </Button>
          </div>
        )}

        {/* Food Items Grid */}
        {!loading && !error && (
          <div className={styles.menuGrid}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <FoodCard 
                  key={item.id} 
                  item={item} 
                  onViewDetails={setSelectedFood} 
                />
              ))
            ) : (
              <div className={styles.emptyResults}>
                <div className={styles.emptyIcon}>🍽️</div>
                <h3>No dishes match your filters</h3>
                <p>Try resetting the search query or choosing a different category.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setDietaryFilter('all');
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick View Popup */}
      {selectedFood && (
        <FoodDetailPopup item={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};

export default Menu;
