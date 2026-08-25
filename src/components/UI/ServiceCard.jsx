import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';
import Button from './Button';
import styles from './ServiceCard.module.scss';

const ServiceCard = ({ service }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={service.image_url || service.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400"} alt={service.name} loading="lazy" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{service.name}</h3>
        <p className={styles.description}>{service.description}</p>
        
        <div className={styles.capacity}>
          <Users size={18} />
          <span>Ideal for: {service.capacity}</span>
        </div>

        <ul className={styles.benefits}>
          {(service.benefits || []).slice(0, 3).map((benefit, idx) => (
            <li key={idx}>
              <CheckCircle size={16} />
              <span>{typeof benefit === 'object' ? benefit.benefit : benefit}</span>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <Link to={service.path || `/catering`}>
            <Button variant="primary">Enquire Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
