import React from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import { MandalaCircle } from './Ornament';
import styles from './FamilySection.module.css';

const FamilySection = () => {
  const { brideFamily, groomFamily } = weddingConfig;

  return (
    <section id="family" className={`section ${styles.family}`} aria-label="Our families">
      <div className={styles.bgMandala} aria-hidden="true">
        <MandalaCircle size={400} color="#6b1020" opacity={0.05} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">United in Love</span>
          <div className="gold-divider" />
          <h2 className="section-title">With the Blessings of Our Families</h2>
          <div style={{ marginTop: 16 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Families */}
        <div className={styles.families}>
          {/* Bride's family */}
          <div className={`reveal-left ${styles.familyCard}`}>
            <div className={styles.familyIcon} aria-hidden="true">🌸</div>
            <h3 className={styles.familyTitle}>Bride's Family</h3>
            <div className={styles.familyDivider} />
            <p className={styles.familyNames}>{brideFamily.parents}</p>
            {brideFamily.siblings && (
              <p className={styles.familyRelative}>{brideFamily.siblings}</p>
            )}
            {brideFamily.additional && (
              <p className={styles.familyAdditional}>{brideFamily.additional}</p>
            )}
          </div>

          {/* Center ornament */}
          <div className={`reveal ${styles.centerOrn}`} aria-hidden="true">
            <div className={styles.ornCircle}>
              <span className={styles.ornText}>✦</span>
            </div>
          </div>

          {/* Groom's family */}
          <div className={`reveal-right ${styles.familyCard}`}>
            <div className={styles.familyIcon} aria-hidden="true">🌺</div>
            <h3 className={styles.familyTitle}>Groom's Family</h3>
            <div className={styles.familyDivider} />
            <p className={styles.familyNames}>{groomFamily.parents}</p>
            {groomFamily.siblings && (
              <p className={styles.familyRelative}>{groomFamily.siblings}</p>
            )}
            {groomFamily.additional && (
              <p className={styles.familyAdditional}>{groomFamily.additional}</p>
            )}
          </div>
        </div>

        {/* Bottom blessings */}
        <div className={`reveal ${styles.blessings}`}>
          <Ornament size={16} />
          <p className={styles.blessingsText}>
            "May this union be as timeless as the stars and as beautiful as the love that binds them."
          </p>
        </div>
      </div>
    </section>
  );
};

export default FamilySection;
