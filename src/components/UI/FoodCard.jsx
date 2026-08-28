import React from 'react';
import { Plus, Minus, Eye, Check } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import Button from './Button';
import styles from './FoodCard.module.scss';
import clsx from 'clsx';

const FoodCard = ({ item, onViewDetails }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((ci) => ci.id === item.id);
  const inCart = !!cartItem;

  const categoryName = typeof item.category === 'object' && item.category 
    ? item.category.name 
    : (item.category || 'Specialty');

  const price = parseFloat(item.price) || 0;
  const isVeg = item.type === 'veg';
  const isFeatured = item.is_featured || item.isFeatured;
  const imageUrl = item.image_url || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(item, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(item.id, cartItem.quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(item.id, cartItem.quantity - 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={() => onViewDetails && onViewDetails(item)}>
        <img src={imageUrl} alt={item.name} loading="lazy" />
        <div className={styles.overlayHover}>
          <span className={styles.viewBtn}>
            <Eye size={16} /> Quick View
          </span>
        </div>

        {/* Veg / Non-Veg Indicator */}
        <div className={clsx(styles.vegBadge, isVeg ? styles.veg : styles.nonVeg)}>
          <span className={styles.vegDot}></span>
        </div>

        {/* Featured Tag */}
        {isFeatured && (
          <span className={styles.featuredBadge}>
            ★ Featured
          </span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.category}>{categoryName}</div>
        <h3 className={styles.title} onClick={() => onViewDetails && onViewDetails(item)} title={item.name}>
          {item.name}
        </h3>
        <p className={styles.description}>{item.description}</p>

        <div className={styles.footer}>
          <div className={styles.priceContainer}>
            <span className={styles.currency}>₹</span>
            <span className={styles.amount}>{price.toFixed(0)}</span>
          </div>

          {inCart ? (
            <div className={styles.cartQtyControls}>
              <button 
                className={styles.qtyBtn} 
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className={styles.qtyCount}>{cartItem.quantity}</span>
              <button 
                className={styles.qtyBtn} 
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="small" 
              onClick={handleAddToCart}
              className={styles.addBtn}
            >
              <Plus size={14} /> Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
