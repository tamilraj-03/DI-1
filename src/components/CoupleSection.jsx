import React from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import { MandalaCircle } from './Ornament';
import styles from './CoupleSection.module.css';

const CoupleSection = () => {
  const { bride, groom, loveStory } = weddingConfig;

  return (
    <section id="couple" className={`section ${styles.couple}`} aria-label="About the couple">
      {/* Background mandala */}
      <div className={styles.bgMandala} aria-hidden="true">
        <MandalaCircle size={500} color="#6b1020" opacity={0.05} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">With Joy & Love</span>
          <div className="gold-divider" />
          <h2 className="section-title">Two Hearts, One Beautiful Journey</h2>
          <div style={{ marginTop: 16 }}>
            <Ornament size={20} />
          </div>
        </header>

        {/* Couple portraits */}
        <div className={styles.portraits}>
          {/* Bride */}
          <div className={`reveal-left ${styles.portraitCard}`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageFrame} aria-hidden="true" />
              <div className={styles.imageCornerTL} aria-hidden="true" />
              <div className={styles.imageCornerBR} aria-hidden="true" />
              <img
                src={bride.photo}
                alt={`Bride ${bride.fullName}`}
                className={styles.portrait}
                loading="lazy"
              />
              <div className={styles.imageGlow} aria-hidden="true" />
            </div>
            <div className={styles.nameTag}>
              <span className={styles.nameRole}>The Bride</span>
              <h3 className={styles.personName}>{bride.fullName}</h3>
              <div className={styles.heartDecor} aria-hidden="true">✦</div>
            </div>
          </div>

          {/* Center ampersand */}
          <div className={`reveal ${styles.centerAnd}`} style={{ transitionDelay: '0.2s' }}>
            <div className={styles.andCircle}>
              <span className={styles.andSymbol}>&amp;</span>
            </div>
          </div>

          {/* Groom */}
          <div className={`reveal-right ${styles.portraitCard}`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageFrame} aria-hidden="true" />
              <div className={styles.imageCornerTL} aria-hidden="true" />
              <div className={styles.imageCornerBR} aria-hidden="true" />
              <img
                src={groom.photo}
                alt={`Groom ${groom.fullName}`}
                className={styles.portrait}
                loading="lazy"
              />
              <div className={styles.imageGlow} aria-hidden="true" />
            </div>
            <div className={styles.nameTag}>
              <span className={styles.nameRole}>The Groom</span>
              <h3 className={styles.personName}>{groom.fullName}</h3>
              <div className={styles.heartDecor} aria-hidden="true">✦</div>
            </div>
          </div>
        </div>

        {/* Love story quote */}
        <div className={`reveal ${styles.loveStory}`} style={{ transitionDelay: '0.3s' }}>
          <div className={styles.quoteIcon} aria-hidden="true">"</div>
          <p className={styles.quoteText}>{loveStory}</p>
          <div className={styles.quoteIcon} aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>"</div>
          <div style={{ marginTop: 20 }}>
            <Ornament size={18} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
