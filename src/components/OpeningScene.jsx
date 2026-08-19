import React, { useState } from 'react';
import { weddingConfig } from '../weddingConfig';
import useGuestName from '../hooks/useGuestName';
import { MandalaCircle } from './Ornament';
import styles from './OpeningScene.module.css';

const OpeningScene = ({ onOpenStart, onOpenComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const guestName = useGuestName();
  const { bride, groom } = weddingConfig;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (onOpenStart) onOpenStart();
    setTimeout(() => {
      if (onOpenComplete) onOpenComplete();
    }, 850);
  };

  return (
    <div className={`${styles.scene} ${isOpening ? styles.sceneOpening : ''}`} role="main">
      {/* Background */}
      <div className={`${styles.bg} ${isOpening ? styles.bgFade : ''}`}>
        <img src="/opening-bg.jpg" alt="" aria-hidden="true" className={styles.bgImg} decoding="async" />
        <div className={styles.bgOverlay} />
      </div>

      {/* Background Mandalas */}
      <div className={styles.mandalaTopRight} aria-hidden="true">
        <MandalaCircle size={340} color="#c8a96e" opacity={0.12} />
      </div>
      <div className={styles.mandalaBottomLeft} aria-hidden="true">
        <MandalaCircle size={300} color="#c8a96e" opacity={0.10} />
      </div>

      {/* ── Royal Invitation Card with 3D Fold & Unfold ── */}
      <div className={`${styles.cardContainer} ${isOpening ? styles.cardUnfolding : ''}`}>
        
        {/* Top Fold Panel */}
        <div className={styles.foldPanelTop} aria-hidden="true">
          <div className={styles.foldPanelInner} />
        </div>

        {/* Main Card Face */}
        <div className={styles.cardFace}>
          {/* Ornate Gold Inner Frame */}
          <div className={styles.cardFrame} aria-hidden="true" />
          <div className={styles.frameCornerTL} aria-hidden="true">✦</div>
          <div className={styles.frameCornerTR} aria-hidden="true">✦</div>
          <div className={styles.frameCornerBL} aria-hidden="true">✦</div>
          <div className={styles.frameCornerBR} aria-hidden="true">✦</div>

          {/* Guest greeting */}
          {guestName && (
            <p className={styles.guestGreeting}>
              Dear {guestName},
            </p>
          )}

          <p className={styles.togetherText}>
            Together with their families
          </p>

          <div className={styles.ornament}>
            <span className={styles.ornLine} />
            <span className={styles.ornDiamond} />
            <span className={styles.ornLine} />
          </div>

          <h1 className={styles.brideName}>{bride.fullName}</h1>
          <div className={styles.ampersand}>&amp;</div>
          <h1 className={styles.groomName}>{groom.fullName}</h1>

          <div className={styles.ornament}>
            <span className={styles.ornLine} />
            <span className={styles.ornDiamond} />
            <span className={styles.ornLine} />
          </div>

          <p className={styles.inviteText}>
            Request the honour of your presence at their
            <br />
            <em>wedding celebration</em>
          </p>

          {/* CTA Button */}
          <button
            id="open-invitation-btn"
            className={`${styles.openBtn} ${isOpening ? styles.openBtnPressed : ''}`}
            onClick={handleOpen}
            aria-label="Open Wedding Invitation"
          >
            <span className={styles.openBtnIcon} aria-hidden="true">✦</span>
            <span className={styles.openBtnText}>OPEN INVITATION</span>
            <span className={styles.openBtnIcon} aria-hidden="true">✦</span>
          </button>
        </div>

        {/* Bottom Fold Panel */}
        <div className={styles.foldPanelBottom} aria-hidden="true">
          <div className={styles.foldPanelInner} />
        </div>
      </div>

      {/* Screen Corner Ornaments */}
      <div className={styles.cornerTL} aria-hidden="true">✦</div>
      <div className={styles.cornerTR} aria-hidden="true">✦</div>
      <div className={styles.cornerBL} aria-hidden="true">✦</div>
      <div className={styles.cornerBR} aria-hidden="true">✦</div>
    </div>
  );
};

export default OpeningScene;
