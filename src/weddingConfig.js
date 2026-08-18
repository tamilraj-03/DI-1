// ============================================================
// WEDDING CONFIGURATION — Edit all wedding details here
// ============================================================

export const weddingConfig = {
  // ── Couple ──────────────────────────────────────────────
  bride: {
    name: "Priya",
    fullName: "Priya Sharma",
    photo: "/bride.jpg",
  },
  groom: {
    name: "Arjun",
    fullName: "Arjun Mehta",
    photo: "/groom.jpg",
  },

  // ── Wedding Date & Time ──────────────────────────────────
  // Set this to your actual wedding date/time (ISO format)
  weddingDate: "2027-02-14T10:30:00",
  weddingDateDisplay: "February 14, 2027",
  weddingTime: "10:30 AM",

  // ── Venue ────────────────────────────────────────────────
  venue: {
    name: "The Grand Leela Palace",
    address: "Sahar Airport Rd, Andheri East, Mumbai, Maharashtra 400059",
    googleMapsUrl: "https://maps.google.com/?q=The+Grand+Leela+Palace+Mumbai",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1!2d72.86!3d19.09!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA1JzI0LjAiTiA3MsKwNTEnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890",
  },

  // ── Events ───────────────────────────────────────────────
  events: [
    {
      id: "engagement",
      icon: "💍",
      title: "Engagement",
      date: "February 10, 2025",
      time: "5:00 PM – 9:00 PM",
      venue: "The Taj Lands End, Bandra West, Mumbai",
      mapsUrl: "https://maps.google.com/?q=Taj+Lands+End+Mumbai",
      color: "#c8a96e",
    },
    {
      id: "mehendi",
      icon: "🌿",
      title: "Mehendi",
      date: "February 11, 2025",
      time: "11:00 AM – 4:00 PM",
      venue: "Sharma Residence, Juhu, Mumbai",
      mapsUrl: "https://maps.google.com/?q=Juhu+Mumbai",
      color: "#4a7c59",
    },

    {
      id: "wedding",
      icon: "❤️",
      title: "Wedding Ceremony",
      date: "February 14, 2025",
      time: "10:30 AM – 2:00 PM",
      venue: "The Grand Leela Palace, Andheri East, Mumbai",
      mapsUrl: "https://maps.google.com/?q=The+Grand+Leela+Palace+Mumbai",
      color: "#8b1a3e",
    },
    {
      id: "reception",
      icon: "🌸",
      title: "Reception",
      date: "February 14, 2025",
      time: "7:00 PM – 11:00 PM",
      venue: "The Grand Leela Palace, Andheri East, Mumbai",
      mapsUrl: "https://maps.google.com/?q=The+Grand+Leela+Palace+Mumbai",
      color: "#c8a96e",
    },
  ],

  // ── Our Story ────────────────────────────────────────────
  loveStory:
    "Two different journeys, two beautiful hearts, and one destiny brought them together. What began as a chance meeting blossomed into a friendship filled with laughter, shared dreams, and endless conversations. Now, hand in hand, they step into a new chapter — filled with love, tradition, and endless beautiful memories.",

  storyTimeline: [
    {
      year: "2019",
      title: "The First Meeting",
      description:
        "A chance encounter at a mutual friend's gathering in Mumbai. They exchanged glances across a room full of people and somehow, the universe paused for just a moment.",
    },
    {
      year: "2020",
      title: "The Beginning",
      description:
        "Long phone calls turned into late-night walks. What started as friendship slowly, beautifully transformed into something neither could explain — only feel.",
    },
    {
      year: "2022",
      title: "Adventures Together",
      description:
        "From weekend getaways to Goa to quiet evenings at home, every moment spent together felt like home. They built their story one memory at a time.",
    },
    {
      year: "2024",
      title: "The Proposal",
      description:
        "Under a sky full of stars at their favourite rooftop restaurant, Arjun got down on one knee. With trembling hands and a full heart, he asked — and Priya said yes.",
    },
    {
      year: "2025",
      title: "The Big Day",
      description:
        "February 14, 2025. The day two families become one, and two hearts begin their forever together.",
    },
  ],

  // ── Families ─────────────────────────────────────────────
  brideFamily: {
    parents: "Mr. Ramesh Sharma & Mrs. Sunita Sharma",
    siblings: "Brother: Rohit Sharma",
    additional: "Paternal: Late Shri. Govind Sharma & Smt. Kamla Sharma",
  },
  groomFamily: {
    parents: "Mr. Vijay Mehta & Mrs. Anjali Mehta",
    siblings: "Sister: Kavya Mehta",
    additional: "Paternal: Shri. Suresh Mehta & Smt. Radha Mehta",
  },

  // ── Gallery ──────────────────────────────────────────────
  gallery: [
    { src: "/couple.jpg", alt: "Priya & Arjun together", category: "couple" },
    { src: "/bride.jpg", alt: "Bridal portrait", category: "bride" },
    { src: "/groom.jpg", alt: "Groom portrait", category: "groom" },
    { src: "/engagement.jpg", alt: "Engagement ceremony", category: "engagement" },
    { src: "/mehendi.jpg", alt: "Mehendi ceremony", category: "mehendi" },
    { src: "/opening-bg.jpg", alt: "Wedding decoration", category: "decor" },
  ],

  // ── Social Sharing ───────────────────────────────────────
  shareMessage:
    "💍 You are cordially invited to the wedding of Priya Sharma & Arjun Mehta on February 14, 2025 at The Grand Leela Palace, Mumbai. Click to view the invitation:",
  shareUrl: "https://priya-arjun-wedding.com",

  // ── Music ────────────────────────────────────────────────
  // Replace with your actual wedding song (mp3/ogg in /public folder)
  musicFile: null, // e.g., "/wedding-music.mp3"

  // ── Guest Param ─────────────────────────────────────────
  guestParamKey: "guest", // URL: ?guest=Tamil
};
