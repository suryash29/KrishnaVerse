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
};
