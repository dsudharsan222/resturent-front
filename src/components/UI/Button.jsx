import React from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

const Button = ({ children, variant = 'primary', size = 'medium', className, ...props }) => {
  return (
    <button 
      className={clsx(styles.button, styles[variant], styles[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
