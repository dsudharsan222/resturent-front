import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';
import useCartStore from '../../store/useCartStore';
import Button from '../UI/Button';
import styles from './FoodDetailPopup.module.scss';

const FoodDetailPopup = ({ item, onClose }) => {
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!item) return null;

  const price = parseFloat(item.price) || 0;
  const isVeg = item.type === 'veg';
  const categoryName = typeof item.category === 'object' && item.category 
    ? item.category.name 
    : (item.category || 'Chef Specialty');

  const imageUrl = item.image_url || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";

  const handleAddToCart = () => {
    addItem(item, qty);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <X size={22} />
        </button>

        <div className={styles.imageSection}>
          <img src={imageUrl} alt={item.name} />
          <div className={clsx(styles.dietaryBadge, isVeg ? styles.veg : styles.nonVeg)}>
            <span className={styles.dot}></span>
            <span>{isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.headerInfo}>
            <span className={styles.category}>{categoryName}</span>
            <h2>{item.name}</h2>
            <div className={styles.priceRow}>
              <span className={styles.price}>₹{price.toFixed(2)}</span>
              <span className={styles.servingInfo}>Freshly prepared per order</span>
            </div>
          </div>

          <p className={styles.description}>
            {item.description || 'Authentic dish prepared with hand-ground spices and fresh premium ingredients.'}
          </p>

          <div className={styles.featuresBox}>
            <div className={styles.featureItem}>
              <Sparkles size={16} className={styles.featureIcon} />
              <span>Authentic Traditional Taste</span>
            </div>
            <div className={styles.featureItem}>
              <Check size={16} className={styles.featureIcon} />
              <span>Available for Daily Dining & Bulk Catering</span>
            </div>
          </div>

          <div className={styles.actionsFooter}>
            <div className={styles.qtyControl}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className={styles.qtyNumber}>{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button 
              variant="primary" 
              size="large" 
              className={styles.addBtn}
              onClick={handleAddToCart}
            >
              {addedAnimation ? (
                <>Added to Cart ✓</>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Order • ₹{(price * qty).toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPopup;
