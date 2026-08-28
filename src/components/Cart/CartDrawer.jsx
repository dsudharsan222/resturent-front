import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import Button from '../UI/Button';
import styles from './CartDrawer.module.scss';
import clsx from 'clsx';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal
  } = useCartStore();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });

  if (!isOpen) return null;

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      clearCart();
      setOrderSuccess(false);
      setCheckoutMode(false);
      closeCart();
    }, 3000);
  };

  const handleCateringQuoteConvert = () => {
    closeCart();
    navigate('/catering/quote');
  };

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <ShoppingBag className={styles.bagIcon} size={22} />
            <h2>Your Order</h2>
            {itemCount > 0 && <span className={styles.countBadge}>{itemCount}</span>}
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {orderSuccess ? (
            <div className={styles.successState}>
              <CheckCircle className={styles.successIcon} size={64} />
              <h3>Order Placed Successfully!</h3>
              <p>Thank you, {customerInfo.name || 'Valued Customer'}. We have received your order and our team is preparing it freshly.</p>
              <div className={styles.orderSummaryBox}>
                <span>Estimated Total: ₹{total.toFixed(2)}</span>
                <span>Payment: {customerInfo.paymentMethod === 'cod' ? 'Cash on Delivery / UPI' : 'Online Payment'}</span>
              </div>
            </div>
          ) : checkoutMode ? (
            <form id="checkoutForm" onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
              <div className={styles.checkoutHeader}>
                <button type="button" className={styles.backBtn} onClick={() => setCheckoutMode(false)}>
                  ← Back to Cart
                </button>
                <h3>Delivery & Contact Details</h3>
              </div>

              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Rahul Sharma"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number (WhatsApp) *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="e.g. +91 98765 43210"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Delivery Address *</label>
                <textarea 
                  required 
                  rows="2"
                  placeholder="Door/Flat No, Landmark, Locality"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Special Cooking / Delivery Notes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Less spicy, extra chutney"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Payment Mode</label>
                <div className={styles.paymentOptions}>
                  <label className={clsx(styles.paymentOption, customerInfo.paymentMethod === 'cod' && styles.active)}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={customerInfo.paymentMethod === 'cod'}
                      onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cod' })}
                    />
                    <span>Cash on Delivery / Scan UPI</span>
                  </label>
                  <label className={clsx(styles.paymentOption, customerInfo.paymentMethod === 'online' && styles.active)}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="online" 
                      checked={customerInfo.paymentMethod === 'online'}
                      onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'online' })}
                    />
                    <span>Card / Net Banking (UPI)</span>
                  </label>
                </div>
              </div>
            </form>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <ShoppingBag size={48} />
              </div>
              <h3>Your basket is empty</h3>
              <p>Explore our authentic delicacies and add your favorite dishes to begin your order.</p>
              <Button 
                variant="primary" 
                onClick={() => {
                  closeCart();
                  navigate('/menu');
                }}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImageContainer}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className={styles.placeholderImg}>🍽️</div>
                    )}
                    <span className={clsx(styles.vegDot, item.type === 'veg' ? styles.veg : styles.nonVeg)}></span>
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h4>{item.name}</h4>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.priceRow}>
                      <span className={styles.itemPrice}>₹{item.price.toFixed(2)}</span>
                      
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.qty}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !orderSuccess && (
          <div className={styles.footer}>
            <div className={styles.priceBreakdown}>
              <div className={styles.breakdownRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Taxes & GST (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className={clsx(styles.breakdownRow, styles.totalRow)}>
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutMode ? (
              <div className={styles.actionButtons}>
                <Button 
                  type="submit" 
                  form="checkoutForm" 
                  variant="primary" 
                  size="large"
                  className={styles.fullWidth}
                >
                  Confirm & Place Order (₹{total.toFixed(2)})
                </Button>
              </div>
            ) : (
              <div className={styles.actionButtons}>
                <Button 
                  variant="primary" 
                  size="large" 
                  className={styles.fullWidth}
                  onClick={() => setCheckoutMode(true)}
                >
                  Checkout Now <ArrowRight size={18} />
                </Button>
                
                <div className={styles.secondaryActions}>
                  <button 
                    type="button" 
                    className={styles.cateringBtn}
                    onClick={handleCateringQuoteConvert}
                  >
                    Need this for a Party / Event? Get Quote →
                  </button>
                  <button 
                    type="button" 
                    className={styles.clearBtn}
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
