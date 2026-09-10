export function formatPhoneDisplay(digits: string) {
  if (digits.startsWith("963") && digits.length >= 10) {
    return `+963 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`.trim();
  }
  return digits ? `+${digits}` : "";
}

export function phoneTel(digits: string) {
  return digits ? `+${digits}` : "";
}

export function whatsappHref(digits: string, message?: string) {
  if (!digits) return "#";
  const url = `https://wa.me/${digits}`;
  if (!message) return url;
  return `${url}?text=${encodeURIComponent(message)}`;
}

export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
  { id: "tiktok", label: "TikTok" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "telegram", label: "Telegram" },
  { id: "other", label: "أخرى" },
] as const;
