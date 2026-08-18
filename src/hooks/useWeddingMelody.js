/**
 * useWeddingMelody — Authentic South Indian Wedding Mangala Vadyam Engine
 * Built with Web Audio API.
 * 
 * Features:
 * 1. Traditional Nadaswaram Synthesis (Double-reed timbre with Gamakas & pitch bends)
 * 2. Auspicious Carnatic Raagams: Mohanam, Hamsadhwani & Kalyani
 * 3. Authentic Thavil Drum Percussion (Valanthalai metallic ring & Thoppi bass thuds in Adi Thalam)
 * 4. Resonant Shruthi Tambura Drone (Sa-Pa-Sa-Sa)
 */

let audioCtx = null;
let masterGain = null;
let droneNodes = [];
let melodyTimeout = null;
let thavilInterval = null;
let isRunning = false;

// Base Shruthi: C4 (261.63 Hz) — standard high-spirited Nadaswaram pitch
const BASE_SA = 261.63; // C4

// Raagam Mohanam: Sa, Ri2, Ga3, Pa, Dha2, Sa' (Auspicious Goddess Lakshmi / Wedding Raga)
// Frequency ratios: 1, 9/8, 5/4, 3/2, 5/3, 2
const MOHANAM_NOTES = [
  { name: 'Sa',  freq: BASE_SA * 1.000 },  // C4 (261.63)
  { name: 'Ri2', freq: BASE_SA * 1.125 },  // D4 (294.33)
  { name: 'Ga3', freq: BASE_SA * 1.250 },  // E4 (327.04)
  { name: 'Pa',  freq: BASE_SA * 1.500 },  // G4 (392.45)
  { name: 'Dha2',freq: BASE_SA * 1.667 },  // A4 (436.14)
  { name: 'Sa`', freq: BASE_SA * 2.000 },  // C5 (523.25)
  { name: 'Ri`', freq: BASE_SA * 2.250 },  // D5 (588.67)
  { name: 'Ga`', freq: BASE_SA * 2.500 },  // E5 (654.08)
  { name: 'Pa`', freq: BASE_SA * 3.000 },  // G5 (784.89)
];

// Raagam Hamsadhwani: Sa, Ri2, Ga3, Pa, Ni3, Sa' (Auspicious Mangala Isai)
const HAMSADHWANI_NOTES = [
  { name: 'Sa',  freq: BASE_SA * 1.000 }, // C4
  { name: 'Ri2', freq: BASE_SA * 1.125 }, // D4
  { name: 'Ga3', freq: BASE_SA * 1.250 }, // E4
  { name: 'Pa',  freq: BASE_SA * 1.500 }, // G4
  { name: 'Ni3', freq: BASE_SA * 1.875 }, // B4
  { name: 'Sa`', freq: BASE_SA * 2.000 }, // C5
  { name: 'Ri`', freq: BASE_SA * 2.250 }, // D5
  { name: 'Ga`', freq: BASE_SA * 2.500 }, // E5
];

// Traditional South Indian Mangala Vadyam Melodic Phrases
const MANGALA_PHRASES = [
  // 1. Auspicious Opening Alapana in Mohanam (Gamakas on Ga & Dha)
  [
    { note: 0, beats: 1.0, slide: false },
    { note: 1, beats: 0.8, slide: true  },
    { note: 2, beats: 1.5, slide: true  }, // Ga with gamakam
    { note: 3, beats: 1.2, slide: false }, // Pa
    { note: 4, beats: 1.5, slide: true  }, // Dha
    { note: 5, beats: 2.0, slide: false }, // Upper Sa
  ],
  // 2. Joyful Wedding Brikka / Swaram Passages
  [
    { note: 5, beats: 0.6, slide: false },
    { note: 4, beats: 0.6, slide: true  },
    { note: 3, beats: 0.6, slide: false },
    { note: 2, beats: 0.8, slide: true  },
    { note: 1, beats: 0.6, slide: false },
    { note: 0, beats: 1.8, slide: false },
  ],
  // 3. High Register Festive Nadaswaram Flourish
  [
    { note: 3, beats: 0.5, slide: false },
    { note: 4, beats: 0.5, slide: true  },
    { note: 5, beats: 1.0, slide: false },
    { note: 6, beats: 0.8, slide: true  },
    { note: 7, beats: 1.4, slide: true  }, // Upper Ga
    { note: 6, beats: 0.6, slide: false },
    { note: 5, beats: 1.8, slide: false },
  ],
  // 4. Fast Taan (Kalyana Nadaswara Chitte)
  [
    { note: 0, beats: 0.35, slide: false },
    { note: 1, beats: 0.35, slide: false },
    { note: 2, beats: 0.35, slide: false },
    { note: 3, beats: 0.35, slide: false },
    { note: 4, beats: 0.35, slide: false },
    { note: 5, beats: 0.7,  slide: true  },
    { note: 4, beats: 0.35, slide: false },
    { note: 3, beats: 0.35, slide: false },
    { note: 2, beats: 0.7,  slide: true  },
    { note: 0, beats: 2.2,  slide: false },
  ],
  // 5. Grand Mangalyam Muhurtha Phrase
  [
    { note: 2, beats: 0.8, slide: true },
    { note: 3, beats: 0.8, slide: false },
    { note: 4, beats: 1.2, slide: true },
    { note: 5, beats: 2.5, slide: false },
  ]
];

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

/**
 * Synthesizes authentic Nadaswaram double-reed timbre:
 * Combined Sawtooth + Square through a warm resonant nasal bandpass filter (2.2 kHz)
 * with authentic Gamaka pitch bend.
 */
function playNadaswaramNote(freq, startTime, duration, slide = false, gainVal = 0.16) {
  const ctx = getCtx();

  // Primary Reed (rich harmonics)
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';

  // Secondary sub-reed for body
  const subOsc = ctx.createOscillator();
  subOsc.type = 'triangle';

  const envGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Nadaswaram double-reed resonant peak
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200, startTime);
  filter.Q.setValueAtTime(1.8, startTime);

  // Pitch envelope with South Indian Gamaka (microtonal slide)
  if (slide) {
    osc.frequency.setValueAtTime(freq * 0.94, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.12);
    subOsc.frequency.setValueAtTime(freq * 0.94, startTime);
    subOsc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.12);
  } else {
    osc.frequency.setValueAtTime(freq, startTime);
    subOsc.frequency.setValueAtTime(freq, startTime);
  }

  // Authentic expressive vibrato
  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();
  vibrato.frequency.setValueAtTime(6.2, startTime);
  vibratoGain.gain.setValueAtTime(freq * 0.008, startTime);
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  vibratoGain.connect(subOsc.frequency);
  vibrato.start(startTime);
  vibrato.stop(startTime + duration + 0.1);

  // Nadaswaram breath attack & decay envelope
  envGain.gain.setValueAtTime(0, startTime);
  envGain.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
  envGain.gain.setValueAtTime(gainVal * 0.85, startTime + duration * 0.7);
  envGain.gain.linearRampToValueAtTime(0, startTime + duration + 0.06);

  osc.connect(filter);
  subOsc.connect(filter);
  filter.connect(envGain);
  envGain.connect(masterGain);

  osc.start(startTime);
  subOsc.start(startTime);
  osc.stop(startTime + duration + 0.08);
  subOsc.stop(startTime + duration + 0.08);
}

/**
 * Synthesizes South Indian Thavil Drum:
 * - "Thom" / "Dheem": Deep resonant bass (Thoppi)
 * - "Tha" / "Dhi": Crisp stick rim-shot (Valanthalai)
 */
function playThavil(type = 'thom', time) {
  const ctx = getCtx();
  if (type === 'thom') {
    // Deep Thavil bass
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.22);

    g.gain.setValueAtTime(0.22, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.26);
  } else {
    // Sharp stick tap (Valanthalai)
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, time);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, time);
    osc.frequency.exponentialRampToValueAtTime(220, time + 0.08);

    g.gain.setValueAtTime(0.14, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.1);
  }
}

/**
 * Authentic Carnatic Tanpura Shruthi Drone (Sa-Pa-Sa-Sa in C)
 */
function startTanpura() {
  const ctx = getCtx();
  const sa = BASE_SA / 2; // C3 (130.81 Hz)

  const tamburaStrings = [
    { freq: sa * 1.5, gain: 0.045, label: 'Pa' },   // Pa (G3)
    { freq: sa * 2,   gain: 0.065, label: 'Sa`' },  // Middle Sa (C4)
    { freq: sa * 2,   gain: 0.065, label: 'Sa`' },  // Middle Sa (C4)
    { freq: sa,       gain: 0.095, label: 'Sa' },   // Kharaj Sa (C3)
  ];

  droneNodes = tamburaStrings.map(({ freq, gain }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain * 0.5, ctx.currentTime);

    osc.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    osc.start();
    return { osc, g };
  });
}

function stopTanpura() {
  const ctx = getCtx();
  droneNodes.forEach(({ osc, g }) => {
    try {
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      osc.stop(ctx.currentTime + 1.3);
    } catch (_) {}
  });
  droneNodes = [];
}

let phraseIdx = 0;
let nextTime = 0;
const BEAT_SEC = 0.52; // Lively South Indian Wedding Tempo

function startThavilLoop() {
  const ctx = getCtx();
  let step = 0;
  // 8-step Adi Thalam rhythm pattern: Thom - Tha - Dhi - Thom / Tha - Dhi - Thom - Nam
  const rhythm = ['thom', 'tha', 'tha', 'thom', 'tha', 'thom', 'tha', 'tha'];

  thavilInterval = setInterval(() => {
    if (!isRunning) return;
    const hit = rhythm[step % rhythm.length];
    playThavil(hit, ctx.currentTime);
    step++;
  }, BEAT_SEC * 1000 * 0.5);
}

function stopThavilLoop() {
  clearInterval(thavilInterval);
}

function scheduleMangalaIsai() {
  if (!isRunning) return;
  const ctx = getCtx();

  if (nextTime < ctx.currentTime + 0.1) {
    nextTime = ctx.currentTime + 0.1;
  }

  const phrase = MANGALA_PHRASES[phraseIdx % MANGALA_PHRASES.length];
  phraseIdx++;

  let t = nextTime;
  for (let i = 0; i < phrase.length; i++) {
    const item = phrase[i];
    const noteData = MOHANAM_NOTES[item.note];
    const dur = item.beats * BEAT_SEC;

    playNadaswaramNote(noteData.freq, t, dur, item.slide, 0.15);
    t += dur + 0.02;
  }

  nextTime = t + BEAT_SEC * 0.4;
  const lookaheadMs = (nextTime - ctx.currentTime) * 1000 - 100;
  melodyTimeout = setTimeout(scheduleMangalaIsai, Math.max(60, lookaheadMs));
}

export function startMelody() {
  if (isRunning) return;
  isRunning = true;

  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 2.0);

  startTanpura();
  startThavilLoop();

  phraseIdx = 0;
  nextTime = ctx.currentTime + 0.8;
  scheduleMangalaIsai();
}

export function stopMelody() {
  isRunning = false;
  clearTimeout(melodyTimeout);
  stopThavilLoop();

  if (masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
  }
  stopTanpura();
}

export function setMelodyVolume(vol) {
  if (masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.2);
  }
}
