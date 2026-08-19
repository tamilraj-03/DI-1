import React, { useRef, useState, useEffect, useCallback } from 'react';
import { weddingConfig } from '../weddingConfig';
import styles from './ScratchReveal.module.css';

/* ── Countdown helpers ─────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0');

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

const SCRATCH_THRESHOLD = 38; // % scratched to trigger auto-reveal

const ScratchReveal = () => {
  const { weddingDate, weddingDateDisplay, weddingTime, venue, bride, groom } = weddingConfig;

  /* Refs */
  const cardWrapRef    = useRef(null);
  const canvasRef      = useRef(null);
  const particleCanvas = useRef(null);
  const isDrawing      = useRef(false);
  const lastPoint      = useRef(null);
  const midPoint       = useRef(null);
  const particles      = useRef([]);
  const animFrameId    = useRef(null);
  const hasRevealedRef = useRef(false);

  /* State */
  const [revealed, setRevealed]               = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [timeLeft, setTimeLeft]               = useState(getTimeLeft(weddingDate));
  const [isPast, setIsPast]                   = useState(!getTimeLeft(weddingDate));
  const [hintHidden, setHintHidden]           = useState(false);
  const [showConfetti, setShowConfetti]       = useState(false);

  /* ── Countdown Tick ─────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft(weddingDate);
      if (!t) {
        setIsPast(true);
        clearInterval(id);
      } else {
        setTimeLeft(t);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [weddingDate]);

  /* ── Draw Crisp Gold Foil Overlay ────────────────────── */
  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const cardWrap = cardWrapRef.current;
    if (!canvas || !cardWrap) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = cardWrap.offsetWidth;
    const h = cardWrap.offsetHeight;

    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.globalCompositeOperation = 'source-over';

    // 1. Rich Metallic Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0.00, '#9e6d1c');
    grad.addColorStop(0.25, '#d4a843');
    grad.addColorStop(0.48, '#fae8a7');
    grad.addColorStop(0.55, '#dfb455');
    grad.addColorStop(0.80, '#be8f2f');
    grad.addColorStop(1.00, '#855613');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Micro Gold Lattice Pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 0; x < w; x += 16) {
      ctx.fillRect(x, 0, 1.5, h);
    }
    for (let y = 0; y < h; y += 16) {
      ctx.fillRect(0, y, w, 1);
    }

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = 'rgba(255, 240, 180, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.strokeStyle = 'rgba(80, 45, 10, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // 4. Corner Ornaments
    ctx.fillStyle = '#5c3505';
    ctx.font = '12px serif';
    ctx.fillText('✦', 20, 26);
    ctx.fillText('✦', w - 28, 26);
    ctx.fillText('✦', 20, h - 20);
    ctx.fillText('✦', w - 28, h - 20);

    // 5. Central Embossed Plaque
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const plaqueW = Math.min(300, w - 36);
    const plaqueH = 80;
    const plaqueX = (w - plaqueW) / 2;
    const plaqueY = (h - plaqueH) / 2;

    ctx.fillStyle = 'rgba(24, 8, 12, 0.28)';
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 12);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 240, 190, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Top Label
    ctx.font = 'bold 12px "Cinzel", "Lato", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.fillText('✦  ROYAL SCRATCH CARD  ✦', w / 2, h / 2 - 14);

    // Subtitle
    ctx.font = 'italic 13px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#fff4d0';
    ctx.shadowBlur = 3;
    ctx.fillText('Touch & scratch to reveal our wedding date', w / 2, h / 2 + 14);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Set destination-out for scratching
    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  /* ── Particle Animation Engine (0% CPU when idle) ── */
  const resizeParticleCanvas = useCallback(() => {
    const pCanvas = particleCanvas.current;
    const cardWrap = cardWrapRef.current;
    if (!pCanvas || !cardWrap) return;
    const pCtx = pCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cardWrap.offsetWidth;
    const h = cardWrap.offsetHeight;
    if (w === 0 || h === 0) return;
    pCanvas.width = w * dpr;
    pCanvas.height = h * dpr;
    pCtx.scale(dpr, dpr);
  }, []);

  const runParticleLoop = useCallback(() => {
    const pCanvas = particleCanvas.current;
    const cardWrap = cardWrapRef.current;
    if (!pCanvas || !cardWrap) return;
    const pCtx = pCanvas.getContext('2d');
    const w = cardWrap.offsetWidth;
    const h = cardWrap.offsetHeight;

    pCtx.clearRect(0, 0, w, h);

    if (particles.current.length === 0) {
      animFrameId.current = null;
      return;
    }

    const colors = ['#ffe89c', '#f5cf68', '#ffffff', '#e2a336', '#ffb070'];

    particles.current = particles.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      if (p.alpha <= 0) return false;

      pCtx.save();
      pCtx.globalAlpha = Math.max(0, p.alpha);
      pCtx.translate(p.x, p.y);
      pCtx.rotate(p.rotation);

      pCtx.fillStyle = p.color || colors[0];
      if (p.shape === 'star') {
        pCtx.font = `${p.size}px serif`;
        pCtx.fillText('✦', -p.size / 2, p.size / 2);
      } else if (p.shape === 'flower') {
        pCtx.font = `${p.size}px serif`;
        pCtx.fillText('❀', -p.size / 2, p.size / 2);
      } else {
        pCtx.beginPath();
        pCtx.arc(0, 0, p.size, 0, Math.PI * 2);
        pCtx.fill();
      }

      pCtx.restore();
      return true;
    });

    animFrameId.current = requestAnimationFrame(runParticleLoop);
  }, []);

  const spawnParticles = useCallback((x, y, count = 2) => {
    const shapes = ['circle', 'star'];
    const colors = ['#fff1b8', '#ffd700', '#ffffff', '#e8c96a'];
    const isMobile = window.innerWidth <= 768;
    const spawnCount = isMobile ? Math.min(count, 2) : count;

    for (let i = 0; i < spawnCount; i++) {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2.5 - 0.8,
        gravity: 0.1,
        size: Math.random() * 6 + 3,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(runParticleLoop);
    }
  }, [runParticleLoop]);

  useEffect(() => {
    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    };
  }, []);

  /* ── Canvas Resize Observer ─────────────────────────── */
  useEffect(() => {
    const cardWrap = cardWrapRef.current;
    if (!cardWrap) return;

    drawFoil();
    resizeParticleCanvas();

    const ro = new ResizeObserver(() => {
      resizeParticleCanvas();
      if (!hasRevealedRef.current) {
        drawFoil();
      }
    });
    ro.observe(cardWrap);
    return () => ro.disconnect();
  }, [drawFoil, resizeParticleCanvas]);

  /* ── Scratch Position & Threshold ───────────────────── */
  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - r.left,
      y: clientY - r.top,
    };
  };

  const calculateProgress = useCallback((canvas) => {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const sampleCols = 24;
    const sampleRows = 16;
    const imgData = ctx.getImageData(0, 0, Math.floor(w * dpr), Math.floor(h * dpr)).data;
    const strideX = Math.floor((w * dpr) / sampleCols);
    const strideY = Math.floor((h * dpr) / sampleRows);
    const totalWidth = Math.floor(w * dpr);

    let cleared = 0;
    let totalSamples = 0;

    for (let row = 0; row < sampleRows; row++) {
      for (let col = 0; col < sampleCols; col++) {
        const px = col * strideX;
        const py = row * strideY;
        const index = (py * totalWidth + px) * 4 + 3;
        if (index < imgData.length) {
          totalSamples++;
          if (imgData[index] < 128) {
            cleared++;
          }
        }
      }
    }

    const pct = Math.min(100, Math.round((cleared / Math.max(1, totalSamples)) * 100));
    setScratchProgress(pct);

    if (pct >= SCRATCH_THRESHOLD && !hasRevealedRef.current) {
      triggerCelebrationReveal(canvas);
    }
  }, []);

  const triggerCelebrationReveal = (canvas) => {
    hasRevealedRef.current = true;
    setRevealed(true);
    setShowConfetti(true);
    setScratchProgress(100);

    const w = canvas ? canvas.offsetWidth : 400;
    const h = canvas ? canvas.offsetHeight : 250;
    for (let i = 0; i < 20; i++) {
      spawnParticles(Math.random() * w, Math.random() * h, 1);
    }

    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  const scratchAt = useCallback((currPos) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 48;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPoint.current) {
      const mid = {
        x: (lastPoint.current.x + currPos.x) / 2,
        y: (lastPoint.current.y + currPos.y) / 2,
      };
      if (midPoint.current) {
        ctx.moveTo(midPoint.current.x, midPoint.current.y);
        ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, mid.x, mid.y);
      } else {
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(currPos.x, currPos.y);
      }
      midPoint.current = mid;
    } else {
      ctx.arc(currPos.x, currPos.y, 24, 0, Math.PI * 2);
    }
    ctx.stroke();

    lastPoint.current = currPos;
    spawnParticles(currPos.x, currPos.y, 2);
  }, [spawnParticles]);

  /* Pointer & Touch Handlers with rAF throttle */
  const moveRafId = useRef(null);

  const handleStart = (e) => {
    if (revealed) return;
    if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = null;
    midPoint.current = null;
    setHintHidden(true);

    const pos = getPos(e, canvasRef.current);
    scratchAt(pos);
  };

  const handleMove = (e) => {
    if (!isDrawing.current || revealed) return;
    if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
    const pos = getPos(e, canvasRef.current);

    if (!moveRafId.current) {
      moveRafId.current = requestAnimationFrame(() => {
        scratchAt(pos);
        moveRafId.current = null;
      });
    }
  };

  const handleEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
    midPoint.current = null;
    if (moveRafId.current) {
      cancelAnimationFrame(moveRafId.current);
      moveRafId.current = null;
    }
    if (canvasRef.current && !revealed) {
      calculateProgress(canvasRef.current);
    }
  };

  /* Replay / Reset */
  const handleReset = () => {
    hasRevealedRef.current = false;
    setRevealed(false);
    setScratchProgress(0);
    setHintHidden(false);
    setShowConfetti(false);
    setTimeout(() => {
      drawFoil();
    }, 60);
  };

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Wedding of ${bride.name} & ${groom.name}`
  )}&dates=20270214T050000Z/20270214T100000Z&details=${encodeURIComponent(
    `Wedding Celebration of ${bride.fullName} & ${groom.fullName}. We look forward to celebrating with you!`
  )}&location=${encodeURIComponent(venue.name + ', ' + venue.address)}`;

  return (
    <section id="scratch-reveal" className={`section ${styles.section}`} aria-label="Scratch to reveal wedding date">
      {/* Background Decor */}
      <div className={styles.bgDecorTop} aria-hidden="true" />
      <div className={styles.bgDecorBottom} aria-hidden="true" />

      {/* Section Header */}
      <div className={`reveal ${styles.header}`}>
        <span className="section-eyebrow">Auspicious Muhurat</span>
        <div className="gold-divider" />
        <h2 className="section-title">Reveal Our Special Day</h2>
        <p className="section-subtitle">
          Gently scratch or swipe the royal gold card to unveil our wedding date and time
        </p>
      </div>

      {/* Progress & Status Indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${revealed ? 100 : scratchProgress}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {revealed ? (
            <span className={styles.statusUnlocked}>✦ Auspicious Date Successfully Revealed! ✦</span>
          ) : (
            <span>✨ {scratchProgress}% Scratched (Clear {SCRATCH_THRESHOLD}% for auto-reveal)</span>
          )}
        </div>
      </div>

      {/* Scratch Card Outer Wrapper */}
      <div className={`reveal ${styles.cardOuter}`}>
        <div ref={cardWrapRef} className={styles.cardWrap}>
          {/* 1. Underlying Revealed Content — Fully Responsive & Never Clipped */}
          <div className={`${styles.revealContent} ${revealed ? styles.revealContentActive : ''}`}>
            <div className={styles.gleamEffect} />

            <div className={styles.revealInner}>
              {/* Top Ornate Tag */}
              <div className={styles.revealPlaqueHeader}>
                <span className={styles.plaqueDot}>✦</span>
                <span className={styles.plaqueTitle}>SAVE THE AUSPICIOUS DATE</span>
                <span className={styles.plaqueDot}>✦</span>
              </div>

              {/* Crystal Clear High-Contrast Date */}
              <div className={styles.dateBanner}>
                <h3 className={styles.revealDateText}>
                  {weddingDateDisplay}
                </h3>
              </div>

              {/* Neat Information Grid */}
              <div className={styles.infoGrid}>
                {/* Muhurat Time Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <span className={styles.infoIcon}>🕙</span>
                    <span className={styles.infoLabel}>MUHURAT</span>
                  </div>
                  <div className={styles.infoVal}>{weddingTime} Onwards</div>
                </div>

                {/* Venue Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <span className={styles.infoIcon}>📍</span>
                    <span className={styles.infoLabel}>VENUE</span>
                  </div>
                  <div className={styles.infoVal}>{venue.name}</div>
                  <div className={styles.infoSubVal}>Andheri East, Mumbai</div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className={styles.actionRow}>
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.calBtn}
                  aria-label="Add to Google Calendar"
                >
                  <span className={styles.btnIcon}>📅</span>
                  <span>Add to Calendar</span>
                </a>
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapBtn}
                  aria-label="Get Directions"
                >
                  <span className={styles.btnIcon}>📍</span>
                  <span>View Map</span>
                </a>
              </div>

              {/* Scratch Again replay link */}
              <button
                type="button"
                onClick={handleReset}
                className={styles.replayBtn}
                aria-label="Scratch again"
              >
                <span>🔄 Scratch Card Again</span>
              </button>
            </div>
          </div>

          {/* 2. Gold Foil Canvas */}
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${revealed ? styles.canvasFaded : ''}`}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            aria-label="Interactive scratch card — swipe to reveal date"
            role="img"
          />

          {/* 3. Particle Canvas (Live Sparkles) */}
          <canvas
            ref={particleCanvas}
            className={styles.particleCanvas}
            aria-hidden="true"
          />

          {/* 4. Floating Guidance Hint */}
          {!hintHidden && !revealed && (
            <div className={styles.hintBadge} aria-hidden="true">
              <span className={styles.hintIcon}>👆</span>
              <span className={styles.hintText}>Swipe to Scratch & Reveal</span>
            </div>
          )}

          {/* 5. Confetti Overlay */}
          {showConfetti && (
            <div className={styles.confettiContainer} aria-hidden="true">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className={styles.confettiPiece}
                  style={{
                    left: `${(i * 4) + Math.random() * 3}%`,
                    animationDelay: `${Math.random() * 0.8}s`,
                    backgroundColor: ['#ffd700', '#ffffff', '#e8a838', '#ff7b90', '#c8a96e'][i % 5],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Countdown to the Big Day ───────────────────────── */}
      <div className={`reveal ${styles.countdownWrap}`} role="timer" aria-live="polite" aria-label="Wedding day countdown">
        <div className={styles.countdownLabel}>
          <span className={styles.countdownDot}>✦</span>
          {isPast ? 'The Celebration Has Begun' : 'Counting Down to Forever'}
          <span className={styles.countdownDot}>✦</span>
        </div>

        {isPast ? (
          <p className={styles.celebrationMsg}>❤️ Priya & Arjun are married!</p>
        ) : (
          <div className={styles.countdown}>
            {[
              { value: timeLeft?.days,    label: 'Days'    },
              { value: timeLeft?.hours,   label: 'Hours'   },
              { value: timeLeft?.minutes, label: 'Minutes' },
              { value: timeLeft?.seconds, label: 'Seconds' },
            ].map(({ value, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className={styles.countSep}>:</span>}
                <div className={styles.countUnit}>
                  <div className={styles.countFlip}>
                    <span className={styles.countNumber} key={value}>
                      {pad(value ?? 0)}
                    </span>
                  </div>
                  <div className={styles.countLabel}>{label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScratchReveal;
