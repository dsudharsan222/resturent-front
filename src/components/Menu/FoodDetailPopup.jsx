import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import styles from './FoodDetailPopup.module.scss';

const FoodDetailPopup = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
        <div className={styles.imageContainer}>
          <img src={item.image} alt={item.name} />
          <div className={clsx(styles.vegBadge, item.type === 'veg' ? styles.veg : styles.nonVeg)}></div>
        </div>
        <div className={styles.content}>
          <span className={styles.category}>{item.category}</span>
          <h2>{item.name}</h2>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.details}>
            <p><strong>Ideal For:</strong> Weddings, Receptions, House Functions</p>
            <p><strong>Note:</strong> This item is part of our comprehensive catering menu. Contact us to include it in your event package.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPopup;
