import React, { useState, useEffect } from 'react';
import { startMelody, stopMelody, setMelodyVolume } from '../hooks/useWeddingMelody';
import styles from './MusicPlayer.module.css';

const MusicPlayer = ({ musicStarted }) => {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show player once invitation is opened
  useEffect(() => {
    if (musicStarted) setVisible(true);
  }, [musicStarted]);

  // Auto-start melody after invitation opens
  useEffect(() => {
    if (musicStarted) {
      // Small delay so page transition completes first
      const t = setTimeout(() => {
        startMelody();
        setPlaying(true);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [musicStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopMelody();
  }, []);

  const toggle = () => {
    if (playing) {
      stopMelody();
      setPlaying(false);
    } else {
      startMelody();
      setPlaying(true);
    }
  };

  if (!visible) return null;

  return (
    <button
      id="music-player-btn"
      className={`${styles.btn} ${playing ? styles.playing : ''}`}
      onClick={toggle}
      aria-label={playing ? 'Pause Mangala Vadyam' : 'Play South Indian Mangala Vadyam'}
      aria-pressed={playing}
      title={playing ? 'Pause Mangala Vadyam' : '♫ Play South Indian Mangala Vadyam (Nadaswaram & Thavil)'}
    >
      {/* Equalizer bars (visible when playing) */}
      {playing && (
        <span className={styles.equalizer} aria-hidden="true">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      )}

      {/* Note icon */}
      <span className={styles.icon} aria-hidden="true">
        {playing ? '♫' : '♪'}
      </span>
    </button>
  );
};

export default MusicPlayer;
