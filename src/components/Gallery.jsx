import React, { useState } from 'react';
import { weddingConfig } from '../weddingConfig';
import Ornament from './Ornament';
import styles from './Gallery.module.css';

const Gallery = () => {
  const { gallery } = weddingConfig;
  const [lightbox, setLightbox] = useState(null); // index | null

  const open  = (i) => setLightbox(i);
  const close = ()  => setLightbox(null);
  const prev  = ()  => setLightbox(i => (i - 1 + gallery.length) % gallery.length);
  const next  = ()  => setLightbox(i => (i + 1) % gallery.length);

  // Keyboard nav
  const handleKeyDown = (e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     close();
  };

  // Touch swipe
  const [touchStart, setTouchStart] = useState(null);
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd   = (e) => {
    if (touchStart === null) return;
    const dx = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    setTouchStart(null);
  };

  return (
    <section
      id="gallery"
      className={`section ${styles.gallerySection}`}
      aria-label="Photo gallery"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={styles.inner}>
        {/* Header */}
        <header className={`reveal ${styles.header}`}>
          <span className="section-eyebrow">Captured Moments</span>
          <div className="gold-divider" />
          <h2 className="section-title">Our Gallery</h2>
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            A glimpse into our beautiful journey together
          </p>
          <div style={{ marginTop: 20 }}>
            <Ornament size={18} />
          </div>
        </header>

        {/* Grid */}
        <div className={styles.grid} role="list">
          {gallery.map((img, i) => (
            <button
              key={i}
              className={`reveal ${styles.gridItem}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
              onClick={() => open(i)}
              aria-label={`View photo: ${img.alt}`}
              role="listitem"
            >
              <img
                src={img.src}
                alt={img.alt}
                className={styles.gridImg}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.gridOverlay}>
                <span className={styles.gridIcon} aria-hidden="true">✦</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo lightbox: ${gallery[lightbox].alt}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className={styles.lightboxBg} onClick={close} aria-hidden="true" />

          {/* Close */}
          <button className={styles.closeBtn} onClick={close} aria-label="Close lightbox">✕</button>

          {/* Prev */}
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prev} aria-label="Previous photo">‹</button>

          {/* Image */}
          <div className={styles.lightboxImgWrap}>
            <img
              src={gallery[lightbox].src}
              alt={gallery[lightbox].alt}
              className={styles.lightboxImg}
              key={lightbox}
            />
            <p className={styles.lightboxCaption}>{gallery[lightbox].alt}</p>
            <p className={styles.lightboxCounter} aria-live="polite">
              {lightbox + 1} / {gallery.length}
            </p>
          </div>

          {/* Next */}
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={next} aria-label="Next photo">›</button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
