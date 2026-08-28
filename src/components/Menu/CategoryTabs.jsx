import React from 'react';
import styles from './CategoryTabs.module.scss';
import clsx from 'clsx';
import { Utensils } from 'lucide-react';

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className={styles.tabsContainer}>
      <button 
        className={clsx(styles.tab, activeCategory === 'all' && styles.active)}
        onClick={() => onSelectCategory('all')}
      >
        <Utensils size={15} />
        <span>All Dishes</span>
      </button>
      
      {categories.map((cat) => (
        <button 
          key={cat.id}
          className={clsx(styles.tab, String(activeCategory) === String(cat.id) && styles.active)}
          onClick={() => onSelectCategory(cat.id)}
        >
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
