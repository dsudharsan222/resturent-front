import React from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className, 
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props 
}) => {
  return (
    <button 
      className={clsx(
        styles.button, 
        styles[variant], 
        styles[size], 
        loading && styles.loading,
        className
      )} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className={styles.spinner} size={18} />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} className={styles.btnIcon} />}
      <span className={styles.btnText}>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} className={styles.btnIcon} />}
    </button>
  );
};

export default Button;
