import React, { useState, useEffect, useRef } from 'react';
import { weddingConfig } from '../weddingConfig';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { id: 'hero',     label: 'Home' },
  { id: 'story',    label: 'Our Story' },
  { id: 'events',   label: 'Events' },
  { id: 'gallery',  label: 'Gallery' },
  { id: 'venue',    label: 'Venue' },
  { id: 'rsvp',     label: 'RSVP' },
];

const Navbar = () => {
  const [active, setActive] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { bride, groom } = weddingConfig;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
      let current = 'hero';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) current = section.id;
      });
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} aria-label="Main navigation">
        <div className={styles.inner}>
          {/* Logo */}
          <button className={styles.logo} onClick={() => scrollTo('hero')} aria-label="Go to top">
            <span className={styles.logoBride}>{bride.name}</span>
            <span className={styles.logoAnd}>&</span>
            <span className={styles.logoGroom}>{groom.name}</span>
          </button>

          {/* Desktop links */}
          <ul className={styles.links} role="list">
            {NAV_LINKS.map(link => (
              <li key={link.id}>
                <button
                  className={`${styles.link} ${active === link.id ? styles.linkActive : ''}`}
                  onClick={() => scrollTo(link.id)}
                  aria-current={active === link.id ? 'page' : undefined}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileMenuInner}>
          <p className={styles.mobileLogoText}>{bride.name} & {groom.name}</p>
          <ul role="list" className={styles.mobileLinks}>
            {NAV_LINKS.map((link, i) => (
              <li key={link.id} style={{ animationDelay: `${i * 0.07}s` }}>
                <button
                  className={`${styles.mobileLink} ${active === link.id ? styles.mobileLinkActive : ''}`}
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
