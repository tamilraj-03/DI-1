import React, { useEffect, useRef } from 'react';

const Petals = ({ count = 18, isGlobal = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = performance.now();

    const isMobile = window.innerWidth <= 768;
    const totalPetals = isMobile ? Math.min(count, 11) : count;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Natural South Indian Wedding Color Palette (Rose, Jasmine, Marigold, Lotus)
    const petalVarieties = [
      // 1. Soft Velvet Rose Petal (Deep Rose Red to Pink)
      {
        type: 'rose',
        gradStops: ['#e63956', '#ff758f', '#ffb3c1'],
        aspect: 1.35,
      },
      // 2. Auspicious Crimson Rose
      {
        type: 'rose',
        gradStops: ['#9d0208', '#d00000', '#dc2f02'],
        aspect: 1.4,
      },
      // 3. Golden Marigold Petal (Samandhi)
      {
        type: 'marigold',
        gradStops: ['#d48b00', '#fca311', '#ffe49e'],
        aspect: 1.1,
      },
      // 4. Amber Saffron Petal
      {
        type: 'marigold',
        gradStops: ['#e85d04', '#f48c06', '#faa307'],
        aspect: 1.2,
      },
      // 5. White Jasmine Blossom (Mallipoo / Mogra)
      {
        type: 'jasmine',
        gradStops: ['#e9ecef', '#ffffff', '#fffdf0'],
        aspect: 1.0,
      },
      // 6. Sacred Pink Lotus Petal
      {
        type: 'lotus',
        gradStops: ['#c77dff', '#e0aaff', '#fbf8cc'],
        aspect: 1.5,
      },
    ];

    // Helper: Draw single organic curved botanical petal
    const drawPetalShape = (ctx, radius, variety) => {
      ctx.beginPath();
      if (variety.type === 'jasmine') {
        // Starlet Jasmine with 4 soft rounded petals
        const r = radius * 0.7;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 2);
          ctx.beginPath();
          ctx.ellipse(0, -r, r * 0.5, r, 0, 0, Math.PI * 2);
          ctx.fillStyle = variety.gradStops[1];
          ctx.fill();
          ctx.restore();
        }
        // Golden center dot
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#f6bd60';
        ctx.fill();
      } else {
        // Realistic curved rose/marigold petal shape with natural curvature
        const rx = radius * 0.75;
        const ry = radius * variety.aspect;

        const grad = ctx.createLinearGradient(0, -ry, 0, ry);
        grad.addColorStop(0.0, variety.gradStops[0]);
        grad.addColorStop(0.5, variety.gradStops[1]);
        grad.addColorStop(1.0, variety.gradStops[2]);

        ctx.moveTo(0, -ry);
        ctx.bezierCurveTo(rx * 1.3, -ry * 0.6, rx * 1.1, ry * 0.4, 0, ry);
        ctx.bezierCurveTo(-rx * 1.1, ry * 0.4, -rx * 1.3, -ry * 0.6, 0, -ry);
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle soft highlight line along central vein
        ctx.beginPath();
        ctx.moveTo(0, -ry * 0.8);
        ctx.quadraticCurveTo(rx * 0.1, 0, 0, ry * 0.8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 0.8;
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
        radius: (depth * 9 + 8) * (isMobile ? 0.85 : 1.0), // 8px to 17px radius
        variety,
        depth,
        // Gentle, feather-like falling speed proportional to depth
        speedY: (depth * 0.65 + 0.45) * 60, // px per sec
        // Smooth sine wave swaying
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.9 + 0.7,
        swayAmplitude: depth * 28 + 18,
        // Organic tumbling & rotation
        rollAngle: Math.random() * Math.PI * 2,
        rollSpeed: (Math.random() - 0.5) * 1.8,
        pitchAngle: Math.random() * Math.PI * 2,
        pitchSpeed: (Math.random() - 0.5) * 1.4,
        yawAngle: Math.random() * Math.PI * 2,
        yawSpeed: (Math.random() - 0.5) * 0.9,
        opacity: depth * 0.35 + 0.55, // 0.55 to 0.9
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Delta-time based animation loop for 100% stutter-free motion
    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // in seconds
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Global soft wind breeze simulation
      const globalWind = Math.sin(currentTime * 0.0006) * 14;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 1. Advance Physics with Delta Time
        p.swayAngle += p.swaySpeed * dt;
        p.rollAngle += p.rollSpeed * dt;
        p.pitchAngle += p.pitchSpeed * dt;
        p.yawAngle += p.yawSpeed * dt;

        // Vertical falling with air resistance lift during flat turns
        const liftFactor = Math.abs(Math.sin(p.pitchAngle)) * 0.3;
        p.y += (p.speedY * (1 - liftFactor)) * dt;

        // Horizontal sway + gentle ambient wind drift
        const swayOffset = Math.sin(p.swayAngle) * p.swayAmplitude;
        p.x += (globalWind * p.depth * 0.4 + Math.cos(p.swayAngle) * 8) * dt;

        // 2. Loop seamlessly when reaching bottom
        if (p.y > height + 35) {
          p.y = -35;
          p.x = Math.random() * width;
          p.swayAngle = Math.random() * Math.PI * 2;
        }
        if (p.x > width + 50) p.x = -50;
        if (p.x < -50) p.x = width + 50;

        // 3. Render 3D Tumbling Translucent Petal
        ctx.save();
        ctx.translate(p.x + swayOffset, p.y);

        // 3D rotations (Euler angles simulation)
        ctx.rotate(p.rollAngle);
        const scaleX = Math.cos(p.yawAngle);
        const scaleY = Math.cos(p.pitchAngle);
        ctx.scale(Math.max(0.15, Math.abs(scaleX)), Math.max(0.15, Math.abs(scaleY)));

        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 4 * p.depth;
        ctx.shadowOffsetY = 2 * p.depth;

        drawPetalShape(ctx, p.radius, p.variety);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
        zIndex: 9999, // Guaranteed to float over all page sections smoothly
      }}
    />
  );
};

export default Petals;
