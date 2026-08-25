import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './QuoteLayout.module.scss';
import clsx from 'clsx';

const QuoteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  // Example path: /catering/quote/wedding/500-1500/both/contact
  // Parts: catering(0), quote(1), wedding(2), guests(3), pref(4), contact(5)
  
  let currentStep = 1;
  if (pathParts.length > 2) currentStep = 2; // eventType selected
  if (pathParts.length > 3) currentStep = 3; // guests selected
  if (pathParts.length > 4) currentStep = 4; // preference selected
  if (pathParts.includes('success')) currentStep = 5;

  const totalSteps = 4;

  const goBack = () => {
    navigate(-1);
  };

  if (currentStep === 5) {
    return (
      <div className={styles.quoteWrapper}>
        <Outlet />
      </div>
    );
  }

  return (
    <div className={styles.quoteWrapper}>
      <div className={`container section-padding ${styles.container}`}>
        
        <div className={styles.header}>
          {currentStep > 1 && (
            <button className={styles.backBtn} onClick={goBack}>
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <div className={styles.stepperContainer}>
            <div className={styles.stepperLabel}>Step {currentStep} of {totalSteps}</div>
            <div className={styles.stepperTrack}>
              <div 
                className={styles.stepperFill} 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default QuoteLayout;
