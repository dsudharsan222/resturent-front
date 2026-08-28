import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';
import Button from './Button';
import styles from './ServiceCard.module.scss';

const ServiceCard = ({ service }) => {
  const serviceImage = service.image_url || service.image || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600";
  const servicePath = service.path || `/catering/${service.id}`;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={serviceImage} alt={service.name} loading="lazy" />
        <div className={styles.overlay}>
          {service.capacity && (
            <span className={styles.capacityBadge}>
              <Users size={14} /> {service.capacity}
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{service.name}</h3>
        <p className={styles.description}>{service.description}</p>

        {service.benefits && service.benefits.length > 0 && (
          <ul className={styles.benefits}>
            {service.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx}>
                <CheckCircle size={15} className={styles.checkIcon} />
                <span>{typeof benefit === 'object' ? benefit.benefit : benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.footer}>
          <Link to={servicePath} className={styles.linkWrap}>
            <Button variant="outline" size="small" className={styles.detailsBtn}>
              Explore Package <ArrowRight size={14} />
            </Button>
          </Link>
          <Link to={`/catering/quote/${service.id}`}>
            <Button variant="primary" size="small">
              Book Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
