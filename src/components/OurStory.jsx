import React, { useEffect, useState } from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import { MandalaCircle } from './Ornament';
import styles from './OurStory.module.css';

const OurStory = () => {
  const { storyTimeline, bride, groom } = weddingConfig;
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 640
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="story" className={`section ${styles.story}`} aria-label="Our love story">
      {/* Background mandala */}
      <div className={styles.bgMandala} aria-hidden="true">
        <MandalaCircle size={600} color="#c8a96e" opacity={0.06} />
      </div>

      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">How It All Began</span>
          <div className="gold-divider" />
          <h2 className="section-title">Our Story</h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            Every love story is beautiful — but ours is our favourite
          </p>
          <div style={{ marginTop: 20 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Timeline */}
        <div className={styles.timeline} role="list">
          {storyTimeline.map((item, i) => {
            const isLeft = i % 2 === 0;
            // On mobile: all cards use vertical fade-up (reveal)
            // On desktop: alternate left/right slide-in
            const revealClass = isMobile
              ? `${styles.mobileCard} reveal`
              : isLeft ? 'reveal-left' : 'reveal-right';

            return (
              <div
                key={i}
                className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right}`}
                role="listitem"
              >
                {/* Card */}
                <div
                  className={`${revealClass} ${styles.card}`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className={styles.cardYear}>{item.year}</div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <div className={styles.cardDivider} />
                  <p className={styles.cardText}>{item.description}</p>
                </div>

                {/* Center dot */}
                <div
                  className={`reveal ${styles.dot}`}
                  aria-hidden="true"
                  style={{ transitionDelay: `${i * 0.12 + 0.08}s` }}
                >
                  <div className={styles.dotInner} />
                </div>

                {/* Empty spacer on opposite side */}
                <div className={styles.spacer} />
              </div>
            );
          })}
        </div>

        {/* End heart */}
        <div className={`reveal ${styles.endHeart}`} aria-hidden="true">
          <div className={styles.heartCircle}>
            <span className={styles.heartEmoji} aria-label="Love">❤️</span>
          </div>
          <p className={styles.endText}>
            <em>{bride.name} & {groom.name}</em>
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
