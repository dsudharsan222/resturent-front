import React from 'react';
import Button from './Button';
import styles from './FoodCard.module.scss';
import clsx from 'clsx';

const FoodCard = ({ item, onViewDetails }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={item.image} alt={item.name} loading="lazy" />
        <div className={clsx(styles.vegBadge, item.type === 'veg' ? styles.veg : styles.nonVeg)}></div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.categoryBadge}>{typeof item.category === 'object' ? item.category.name : item.category}</span>
          <Button 
            variant="outline" 
            size="small" 
            onClick={() => onViewDetails(item)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
