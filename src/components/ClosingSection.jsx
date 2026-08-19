import React from 'react';
import { weddingConfig } from '../weddingConfig';
import Petals from './Petals';
import { MandalaCircle } from './Ornament';
import styles from './ClosingSection.module.css';

const ClosingSection = () => {
  const { bride, groom, weddingDateDisplay } = weddingConfig;

  return (
    <section className={`section ${styles.closing}`} aria-label="Closing message">
      {/* Background */}
      <div className={styles.bg}>
        <img src="/couple.jpg" alt="" aria-hidden="true" className={styles.bgImg} />
        <div className={styles.bgOverlay} />
      </div>

      {/* Petals */}
      <Petals count={18} />

      {/* Mandala */}
      <div className={styles.mandala} aria-hidden="true">
        <MandalaCircle size={500} color="#c8a96e" opacity={0.1} />
      </div>

      <div className={styles.content}>
        {/* Main heading */}
        <div className={`reveal ${styles.topText}`}>
          <p className={styles.eyebrow}>A Heartfelt Invitation</p>
          <div className={styles.goldLine} aria-hidden="true" />
        </div>

        <h2 className={`reveal ${styles.mainTitle}`} style={{ transitionDelay: '0.1s' }}>
          Your Presence Is Our<br />Greatest Gift
        </h2>

        {/* Ornamental divider */}
        <div className={`reveal ${styles.orn}`} aria-hidden="true" style={{ transitionDelay: '0.2s' }}>
          <span className={styles.ornLine} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornLine} />
        </div>

        {/* Names */}
        <div className={`reveal ${styles.names}`} style={{ transitionDelay: '0.3s' }}>
          <span className={styles.brideName}>{bride.fullName}</span>
          <span className={styles.and}>&amp;</span>
          <span className={styles.groomName}>{groom.fullName}</span>
        </div>

        <p className={`reveal ${styles.date}`} style={{ transitionDelay: '0.4s' }}>{weddingDateDisplay}</p>

        {/* Message */}
        <p className={`reveal ${styles.message}`} style={{ transitionDelay: '0.5s' }}>
          With love, laughter and blessings, we look forward to celebrating
          <br />this beautiful beginning with you.
        </p>

        {/* Animated heart */}
        <div className={`reveal ${styles.heartWrap}`} style={{ transitionDelay: '0.6s' }} aria-hidden="true">
          <span className={styles.heart}>❤️</span>
        </div>

        {/* Footer note */}
        <p className={`reveal ${styles.footerNote}`} style={{ transitionDelay: '0.7s' }}>
          Made with love · {weddingDateDisplay}
        </p>
      </div>

      {/* Corner border */}
      <div className={styles.borderTL} aria-hidden="true" />
      <div className={styles.borderTR} aria-hidden="true" />
      <div className={styles.borderBL} aria-hidden="true" />
      <div className={styles.borderBR} aria-hidden="true" />
    </section>
  );
};

export default ClosingSection;
