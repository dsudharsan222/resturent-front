import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import styles from './HeroSection.module.scss';

const HeroSection = ({ restaurant }) => {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${restaurant.images.hero})` }}>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>Authentic South Indian Cuisine</h1>
        <p className={styles.tagline}>{restaurant.tagline}</p>
        <div className={styles.actions}>
          <Link to="/menu">
            <Button size="large">View Menu</Button>
          </Link>
          <a href={`tel:${restaurant.phone.reservations}`}>
            <Button variant="outline" size="large" className={styles.whiteOutline}>Book a Table</Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
