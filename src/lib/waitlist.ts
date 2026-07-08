/** LaunchList form key — submissions go to getlaunchlist.com, not the app DB. */
export const LAUNCHLIST_FORM_KEY = "Rm5DQo";

export const LAUNCHLIST_SUBMIT_URL = `https://getlaunchlist.com/s/${LAUNCHLIST_FORM_KEY}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TAG_OR_ENTITY = /<[^>]*>|&(?:#\d+|#x[\da-f]+|[a-z]+);/gi;

/** Strip markup and control chars so name cannot carry script/HTML payloads. */
export function sanitizeWaitlistName(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(TAG_OR_ENTITY, "")
    .replace(CONTROL_CHARS, "")
    .trim()
    .slice(0, 80);
}

export function sanitizeWaitlistEmail(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(CONTROL_CHARS, "")
    .trim()
    .toLowerCase()
    .slice(0, 254);
}

export function isValidWaitlistEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  if (email.includes("<") || email.includes(">") || email.includes('"')) return false;
  return EMAIL_PATTERN.test(email);
}
