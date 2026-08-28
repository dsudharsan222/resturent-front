import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles } from 'lucide-react';
import styles from './QuoteLayout.module.scss';
import clsx from 'clsx';

const steps = [
  { number: 1, title: 'Event Type' },
  { number: 2, title: 'Guest Count' },
  { number: 3, title: 'Food Preference' },
  { number: 4, title: 'Contact & Date' }
];

const QuoteLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  // Example path: /catering/quote/wedding/500-1500/both/contact
  
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
      {/* Top Banner */}
      <div className={styles.topHeader}>
        <div className="container">
          <span className={styles.wizardBadge}>
            <Sparkles size={14} /> Guided Catering Estimator
          </span>
          <h1>Build Your Custom Catering Package</h1>
          <p>Complete 4 simple steps to receive a customized quote with tailored menu options.</p>
        </div>
      </div>

      <div className={`container ${styles.container}`}>
        {/* Stepper Bar */}
        <div className={styles.stepperContainer}>
          <div className={styles.stepsNav}>
            {steps.map((step) => {
              const isDone = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div 
                  key={step.number} 
                  className={clsx(
                    styles.stepItem, 
                    isDone && styles.done, 
                    isCurrent && styles.current
                  )}
                >
                  <div className={styles.stepBubble}>
                    {isDone ? <Check size={16} /> : step.number}
                  </div>
                  <div className={styles.stepText}>
                    <span className={styles.stepLabel}>Step {step.number}</span>
                    <span className={styles.stepTitle}>{step.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <div className={styles.backRow}>
            <button className={styles.backBtn} onClick={goBack}>
              <ChevronLeft size={18} /> Previous Step
            </button>
          </div>
        )}

        {/* Main Step Content */}
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default QuoteLayout;
