import React from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import styles from './VenueSection.module.css';

const VenueSection = () => {
  const { venue, weddingDateDisplay, weddingTime } = weddingConfig;

  return (
    <section id="venue" className={`section ${styles.venueSection}`} aria-label="Wedding venue">
      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">You Are Invited</span>
          <div className="gold-divider" />
          <h2 className="section-title">The Venue</h2>
          <div style={{ marginTop: 16 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Venue card */}
        <div className={`reveal ${styles.venueCard}`}>
          {/* Left: venue info */}
          <div className={styles.venueInfo}>
            <div className={styles.venueIconRow} aria-hidden="true">
              <span className={styles.venueIcon}>🏛️</span>
            </div>
            <h3 className={styles.venueName}>{venue.name}</h3>
            <p className={styles.venueAddress}>{venue.address}</p>

            <div className={styles.venueDivider} />

            <div className={styles.venueMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{weddingDateDisplay}</span>
              </div>
              <div className={styles.metaSep} aria-hidden="true">✦</div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Time</span>
                <span className={styles.metaValue}>{weddingTime}</span>
              </div>
            </div>

            <a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
              aria-label="Get directions to venue on Google Maps"
            >
              <span aria-hidden="true">📍</span>
              Get Directions
            </a>
          </div>

          {/* Right: map embed */}
          <div className={styles.mapWrap}>
            <div className={styles.mapOverlay} aria-hidden="true" />
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed&z=15`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 280 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing location of ${venue.name}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
