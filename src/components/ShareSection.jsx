import React from 'react';
import { weddingConfig } from '../weddingConfig';
import styles from './ShareSection.module.css';

const ShareSection = () => {
  const { shareMessage, shareUrl, bride, groom } = weddingConfig;

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${shareMessage}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Invitation link copied! 🎉');
    } catch {
      prompt('Copy this link:', shareUrl);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bride.name} & ${groom.name} Wedding Invitation`,
          text: shareMessage,
          url: shareUrl,
        });
      } catch {}
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <section className={`section ${styles.share}`} aria-label="Share invitation">
      <div className={styles.inner}>
        <div className={`reveal ${styles.card}`}>
          <span className={styles.shareIcon} aria-hidden="true">💌</span>
          <h2 className={styles.title}>Share the Invitation</h2>
          <p className={styles.subtitle}>
            Spread the joy — invite your loved ones to celebrate with us
          </p>

          <div className={styles.buttons}>
            <button
              id="whatsapp-share-btn"
              className={`${styles.btn} ${styles.btnWhatsApp}`}
              onClick={shareWhatsApp}
              aria-label="Share on WhatsApp"
            >
              <span aria-hidden="true">💬</span>
              Share on WhatsApp
            </button>

            <button
              id="copy-link-btn"
              className={`${styles.btn} ${styles.btnCopy}`}
              onClick={copyLink}
              aria-label="Copy invitation link"
            >
              <span aria-hidden="true">🔗</span>
              Copy Link
            </button>

            {hasNativeShare && (
              <button
                id="native-share-btn"
                className={`${styles.btn} ${styles.btnNative}`}
                onClick={nativeShare}
                aria-label="Share via your device"
              >
                <span aria-hidden="true">↗</span>
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareSection;
