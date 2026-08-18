import React from 'react';

// Elegant SVG ornamental divider with mandala/lotus motif
const Ornament = ({ size = 40, color = '#c8a96e', className = '' }) => (
  <svg
    width={size * 5}
    height={size * 0.8}
    viewBox="0 0 200 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left line */}
    <line x1="0" y1="16" x2="70" y2="16" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" />
    {/* Left small diamond */}
    <polygon points="72,16 76,12 80,16 76,20" fill={color} fillOpacity="0.5" />
    {/* Center lotus */}
    <g transform="translate(100,16)">
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-6}
          rx={2}
          ry={5}
          fill={color}
          fillOpacity="0.7"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center circle */}
      <circle cx="0" cy="0" r="3" fill={color} />
    </g>
    {/* Right small diamond */}
    <polygon points="120,16 124,12 128,16 124,20" fill={color} fillOpacity="0.5" />
    {/* Right line */}
    <line x1="130" y1="16" x2="200" y2="16" stroke={color} strokeWidth="0.8" strokeOpacity="0.6" />
  </svg>
);

// Corner decoration for sections
export const CornerOrnament = ({ color = '#c8a96e' }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 0 L80 0" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <path d="M0 0 L0 80" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <circle cx="20" cy="20" r="3" fill={color} fillOpacity="0.5" />
    <path d="M8 8 Q20 0 32 8 Q20 16 8 8Z" fill={color} fillOpacity="0.3" />
    <circle cx="8" cy="8" r="2" fill={color} fillOpacity="0.6" />
  </svg>
);

// Mandala circle for backgrounds
export const MandalaCircle = ({ size = 200, color = '#c8a96e', opacity = 0.08 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ opacity }}
  >
    <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="0.5" />
    <circle cx="100" cy="100" r="75" stroke={color} strokeWidth="0.5" />
    <circle cx="100" cy="100" r="55" stroke={color} strokeWidth="0.5" />
    <circle cx="100" cy="100" r="35" stroke={color} strokeWidth="1" />
    <circle cx="100" cy="100" r="15" stroke={color} strokeWidth="1" />
    <circle cx="100" cy="100" r="5" fill={color} />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 100 + 35 * Math.cos(rad);
      const y1 = 100 + 35 * Math.sin(rad);
      const x2 = 100 + 95 * Math.cos(rad);
      const y2 = 100 + 95 * Math.sin(rad);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.4" strokeOpacity="0.6" />
      );
    })}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 100 + 75 * Math.cos(rad);
      const cy = 100 + 75 * Math.sin(rad);
      return <circle key={i} cx={cx} cy={cy} r="4" fill={color} fillOpacity="0.5" />;
    })}
  </svg>
);

export default Ornament;
