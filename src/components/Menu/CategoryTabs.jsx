import React from 'react';
import styles from './CategoryTabs.module.scss';
import clsx from 'clsx';

const CategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className={styles.tabsContainer}>
      <button 
        className={clsx(styles.tab, activeCategory === 'all' && styles.active)}
        onClick={() => onSelectCategory('all')}
      >
        All Items
      </button>
      {categories.map(cat => (
        <button 
          key={cat.id}
          className={clsx(styles.tab, activeCategory === cat.id && styles.active)}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
