import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import './App.css';

// Components
import OpeningScene   from './components/OpeningScene';
import Hero           from './components/Hero';
import ScratchReveal  from './components/ScratchReveal';
import CoupleSection  from './components/CoupleSection';
import OurStory       from './components/OurStory';
import EventsSection  from './components/EventsSection';
import Gallery        from './components/Gallery';
import FamilySection  from './components/FamilySection';
import VenueSection   from './components/VenueSection';
import ClosingSection from './components/ClosingSection';
import MusicPlayer    from './components/MusicPlayer';
import Petals         from './components/Petals';

// Hooks
import useScrollReveal from './hooks/useScrollReveal';

function App() {
  const [openingMounted, setOpeningMounted] = useState(true);
  const [mainVisible, setMainVisible]       = useState(false);
  const [musicStarted, setMusicStarted]     = useState(false);
  const mainRef = useRef(null);

  // Activate scroll reveal observer once main content is shown
  useScrollReveal();

  // Re-trigger scroll reveal after main content mounts
  useEffect(() => {
    if (!mainVisible) return;
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timeout);
  }, [mainVisible]);

  // When user clicks Open Invitation:
  // 1. Start music immediately
  // 2. Mount main invitation behind folding doors
  const handleOpenStart = () => {
    setMusicStarted(true);
    setMainVisible(true);
  };

  // 3. Unmount opening scene once the 3D paper fold completes
  const handleOpenComplete = () => {
    setOpeningMounted(false);
  };

  return (
    <div className="app-root">
      {/* Full-Page Auspicious Flower Shower (Rose, Jasmine, Marigold) */}
      <Petals isGlobal={true} count={18} />

      {/* 3D Paper Fold Opening Scene */}
      {openingMounted && (
        <OpeningScene
          onOpenStart={handleOpenStart}
          onOpenComplete={handleOpenComplete}
        />
      )}

      {/* Main invitation content — reveals from within with 3D paper unfold */}
      {mainVisible && (
        <div
          ref={mainRef}
          id="main-invitation"
          className="main-invitation-container"
        >
          {/* Floating music player */}
          <MusicPlayer musicStarted={musicStarted} />

          {/* Sections — in narrative order */}
          <Hero />
          <ScratchReveal />
          <CoupleSection />
          <OurStory />
          <EventsSection />
          <Gallery />
          <FamilySection />
          <VenueSection />
          <ClosingSection />
        </div>
      )}

      {/* 3D Paper Unfold Keyframes for Main Invitation */}
      <style>{`
        .app-root {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--ivory);
        }

        .main-invitation-container {
          animation: paperUnfold 0.95s cubic-bezier(0.22, 1, 0.36, 1) both;
          transform-origin: center top;
          will-change: transform, opacity;
        }

        @keyframes paperUnfold {
          0% {
            opacity: 0;
            transform: scale(0.96) translateY(20px);
            filter: blur(2px) brightness(0.9);
          }
          40% {
            opacity: 0.8;
            filter: blur(0px) brightness(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
