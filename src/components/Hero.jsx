import React from 'react';
import { weddingConfig } from '../weddingConfig';
import useGuestName from '../hooks/useGuestName';
import { MandalaCircle } from './Ornament';
import styles from './Hero.module.css';

const Hero = () => {
  const { bride, groom, venue } = weddingConfig;
  const guestName = useGuestName();

  return (
    <section id="hero" className={styles.hero} aria-label="Wedding Hero">
      {/* Background couple photo */}
      <div className={styles.heroBg}>
        <img
          src="/couple.jpg"
          alt={`${bride.name} and ${groom.name}`}
          className={styles.heroBgImg}
          decoding="async"
          fetchPriority="high"
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Mandala bg decorations */}
      <div className={styles.mandalaTop} aria-hidden="true">
        <MandalaCircle size={400} color="#c8a96e" opacity={0.07} />
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        {/* Guest greeting */}
        {guestName && (
          <p className={styles.guestGreeting}>
            Dear {guestName}, you are warmly invited
          </p>
        )}

        {/* Eyebrow */}
        <p className={styles.eyebrow}>The Wedding Celebration of</p>

        {/* Names */}
        <h1 className={styles.coupleNames}>
          <span className={styles.brideName}>{bride.name}</span>
          <span className={styles.and}>&amp;</span>
          <span className={styles.groomName}>{groom.name}</span>
        </h1>

        {/* Venue Tag (Date hidden for scratch surprise) */}
        <div className={styles.meta}>
          <p className={styles.venueName}>📍 {venue.name}, Mumbai</p>
        </div>

        {/* Ornament */}
        <div className={styles.ornament} aria-hidden="true">
          <span className={styles.ornLine} />
          <span className={styles.ornDiamond} />
          <span className={styles.ornLine} />
        </div>

        {/* Scroll indicator & Scratch CTA */}
        <button
          className={styles.scrollIndicator}
          onClick={() => document.getElementById('scratch-reveal')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to scratch and reveal date"
        >
          <span className={styles.scrollText}>✦ Scratch to Reveal Special Day ✦</span>
          <span className={styles.scrollArrow} aria-hidden="true">↓</span>
        </button>
      </div>

      {/* Elegant border corners */}
      <div className={styles.borderTL} aria-hidden="true" />
      <div className={styles.borderTR} aria-hidden="true" />
      <div className={styles.borderBL} aria-hidden="true" />
      <div className={styles.borderBR} aria-hidden="true" />
    </section>
  );
};

export default Hero;
