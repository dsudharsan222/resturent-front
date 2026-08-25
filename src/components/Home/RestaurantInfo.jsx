import React from 'react';
import styles from './RestaurantInfo.module.scss';

const RestaurantInfo = ({ restaurant }) => {
  return (
    <section className={`section-padding ${styles.infoSection}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>Our Story</h2>
          <p className={styles.description}>{restaurant.description}</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Authentic Recipes</h3>
              <p>Hand-pounded spices & traditional cooking.</p>
            </div>
            <div className={styles.feature}>
              <h3>Fresh Ingredients</h3>
              <p>Farm-fresh vegetables and premium meats.</p>
            </div>
          </div>
        </div>
        <div className={styles.imageContent}>
          <img src={restaurant.images.about} alt="About Bisi Bisi" className={styles.aboutImage} />
          <div className={styles.badge}>
            <span>Est. 2022</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantInfo;
