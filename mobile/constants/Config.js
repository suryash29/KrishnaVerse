// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚙️  CONFIG — EDIT THESE VALUES (single source of truth)      ║
// ║  • shopWhatsApp: your WhatsApp business number in intl        ║
// ║    format with no '+' or spaces, e.g. '919812345678'.        ║
// ║    Leave '' to open WhatsApp without a preset recipient.      ║
// ║  • upi: the UPI ID for each donation cause.                   ║
// ╚══════════════════════════════════════════════════════════════╝
export const KV_CONFIG = {
  shopWhatsApp: '', // TODO: set your WhatsApp number, e.g. '919812345678'
  upi: {
    goseva: 'goseva@upi',     // TODO: set real UPI IDs
    gita: 'gitadaan@upi',
    temple: 'templeseva@upi',
  },
  premiumUpi: 'krishnaverse@upi', // TODO: set real UPI ID for ₹199/yr Premium
  premiumPrice: 199,              // ₹/year
};

// ╔══════════════════════════════════════════════════════════════╗
// ║  🔊  CHAPTER_AUDIO — authentic recitation (Premium feature)   ║
// ║  Paste a DIRECT, streamable audio URL (.mp3/.ogg) per chapter.║
// ║  Leave '' for chapters not added yet (shows "coming soon").   ║
// ║  Suggested source: Internet Archive 'SrimadBhagavadGita_201712'║
// ║  (chanting by T. S. Ranganathan). CONFIRM the licence permits ║
// ║  embedding before publishing. Form: https://archive.org/download/<id>/<file> ║
// ╚══════════════════════════════════════════════════════════════╝
export const CHAPTER_AUDIO = {
  1: '',  2: '',  3: '',  4: '',  5: '',  6: '',
  7: '',  8: '',  9: '', 10: '', 11: '', 12: '',
  13: '', 14: '', 15: '', 16: '', 17: '', 18: '',
};
