import React from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import styles from './EventsSection.module.css';

const EventCard = ({ event, index }) => (
  <article
    className={`reveal ${styles.card}`}
    style={{ transitionDelay: `${index * 0.12}s` }}
    aria-label={`${event.title} event`}
  >
    {/* Color strip at top */}
    <div className={styles.cardStrip} style={{ background: event.color }} />

    {/* Icon */}
    <div className={styles.iconWrap} aria-hidden="true">
      <span className={styles.icon}>{event.icon}</span>
    </div>

    {/* Title */}
    <h3 className={styles.title}>{event.title}</h3>

    {/* Details */}
    <dl className={styles.details}>
      <div className={styles.detailRow}>
        <dt className={styles.detailLabel}>Date</dt>
        <dd className={styles.detailValue}>{event.date}</dd>
      </div>
      <div className={styles.detailRow}>
        <dt className={styles.detailLabel}>Time</dt>
        <dd className={styles.detailValue}>{event.time}</dd>
      </div>
      <div className={styles.detailRow}>
        <dt className={styles.detailLabel}>Venue</dt>
        <dd className={styles.detailValue}>{event.venue}</dd>
      </div>
    </dl>

    {/* View Location button */}
    <a
      href={event.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.mapsBtn}
      aria-label={`View location for ${event.title} on Google Maps`}
    >
      <span>📍</span>
      View Location
    </a>
  </article>
);

const EventsSection = () => {
  const { events } = weddingConfig;

  return (
    <section id="events" className={`section ${styles.events}`} aria-label="Wedding events">
      {/* Background pattern */}
      <div className={styles.bgPattern} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">Join Us For</span>
          <div className="gold-divider" />
          <h2 className="section-title">Wedding Celebrations</h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            A series of beautiful ceremonies, each a cherished chapter in our love story
          </p>
          <div style={{ marginTop: 20 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Cards grid */}
        <div className={styles.grid} role="list">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
