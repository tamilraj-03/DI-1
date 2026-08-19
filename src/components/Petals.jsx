import React, { useEffect, useRef } from 'react';

const Petals = ({ count = 16, isGlobal = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationFrameId;
    let lastTime = performance.now();
    let isVisible = true;

    const isMobile = window.innerWidth <= 768;
    // Keep count lightweight on mobile for solid 60+ FPS
    const totalPetals = isMobile ? Math.min(count, 8) : Math.min(count, 14);

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Natural South Indian Wedding Color Palette (Rose, Jasmine, Marigold, Lotus)
    const petalVarieties = [
      {
        type: 'rose',
        colors: ['#e63956', '#ff758f', '#ffb3c1'],
        aspect: 1.35,
      },
      {
        type: 'rose',
        colors: ['#9d0208', '#d00000', '#dc2f02'],
        aspect: 1.4,
      },
      {
        type: 'marigold',
        colors: ['#d48b00', '#fca311', '#ffe49e'],
        aspect: 1.1,
      },
      {
        type: 'marigold',
        colors: ['#e85d04', '#f48c06', '#faa307'],
        aspect: 1.2,
      },
      {
        type: 'jasmine',
        colors: ['#e9ecef', '#ffffff', '#fffdf0'],
        aspect: 1.0,
      },
      {
        type: 'lotus',
        colors: ['#c77dff', '#e0aaff', '#fbf8cc'],
        aspect: 1.5,
      },
    ];

    // Helper: Draw single organic curved botanical petal (NO expensive shadowBlur)
    const drawPetalShape = (ctx, radius, variety) => {
      if (variety.type === 'jasmine') {
        // Starlet Jasmine with 4 soft rounded petals
        const r = radius * 0.65;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 2);
          ctx.beginPath();
          ctx.ellipse(0, -r, r * 0.45, r, 0, 0, Math.PI * 2);
          ctx.fillStyle = variety.colors[1];
          ctx.fill();
          ctx.restore();
        }
        // Golden center dot
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#f6bd60';
        ctx.fill();
      } else {
        // Realistic curved rose/marigold petal shape
        const rx = radius * 0.75;
        const ry = radius * variety.aspect;

        const grad = ctx.createLinearGradient(0, -ry, 0, ry);
        grad.addColorStop(0.0, variety.colors[0]);
        grad.addColorStop(0.5, variety.colors[1]);
        grad.addColorStop(1.0, variety.colors[2]);

        ctx.beginPath();
        ctx.moveTo(0, -ry);
        ctx.bezierCurveTo(rx * 1.3, -ry * 0.6, rx * 1.1, ry * 0.4, 0, ry);
        ctx.bezierCurveTo(-rx * 1.1, ry * 0.4, -rx * 1.3, -ry * 0.6, 0, -ry);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle center vein highlight
        ctx.beginPath();
        ctx.moveTo(0, -ry * 0.7);
        ctx.quadraticCurveTo(rx * 0.08, 0, 0, ry * 0.7);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    };

    // Initialize 3D Depth Layers for Cinematic Parallax
    const petals = [];
    for (let i = 0; i < totalPetals; i++) {
      const depth = Math.random(); // 0 (far) to 1 (near)
      const variety = petalVarieties[Math.floor(Math.random() * petalVarieties.length)];

      petals.push({
        x: Math.random() * width,
        y: Math.random() * (height + 200) - 200,
        radius: (depth * 8 + 7) * (isMobile ? 0.8 : 1.0),
        variety,
        depth,
        speedY: (depth * 0.55 + 0.35) * 55, // gentle falling speed
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.8 + 0.6,
        swayAmplitude: depth * 22 + 14,
        rollAngle: Math.random() * Math.PI * 2,
        rollSpeed: (Math.random() - 0.5) * 1.4,
        pitchAngle: Math.random() * Math.PI * 2,
        pitchSpeed: (Math.random() - 0.5) * 1.1,
        yawAngle: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() - 0.5) * 0.8,
        opacity: depth * 0.3 + 0.55,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        lastTime = performance.now();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Delta-time based animation loop with pause on inactive tab
    const render = (currentTime) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta time
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const globalWind = Math.sin(currentTime * 0.0005) * 10;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 1. Advance Physics with Delta Time
        p.swayAngle += p.swaySpeed * dt;
        p.rollAngle += p.rollSpeed * dt;
        p.pitchAngle += p.pitchSpeed * dt;
        p.yawAngle += p.yawSpeed * dt;

        const liftFactor = Math.abs(Math.sin(p.pitchAngle)) * 0.25;
        p.y += (p.speedY * (1 - liftFactor)) * dt;

        const swayOffset = Math.sin(p.swayAngle) * p.swayAmplitude;
        p.x += (globalWind * p.depth * 0.35 + Math.cos(p.swayAngle) * 6) * dt;

        // 2. Loop seamlessly when reaching bottom
        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
          p.swayAngle = Math.random() * Math.PI * 2;
        }
        if (p.x > width + 40) p.x = -40;
        if (p.x < -40) p.x = width + 40;

        // 3. Render 3D Tumbling Translucent Petal
        ctx.save();
        ctx.translate(p.x + swayOffset, p.y);

        ctx.rotate(p.rollAngle);
        const scaleX = Math.cos(p.yawAngle);
        const scaleY = Math.cos(p.pitchAngle);
        ctx.scale(Math.max(0.18, Math.abs(scaleX)), Math.max(0.18, Math.abs(scaleY)));

        ctx.globalAlpha = p.opacity;

        drawPetalShape(ctx, p.radius, p.variety);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    />
  );
};

export default Petals;

