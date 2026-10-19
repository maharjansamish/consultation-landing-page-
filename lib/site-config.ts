export const siteConfig = {
  name: "Samish Digital Wave",
  tagline: "AI-Powered Digital Marketing",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "9779843831005",
  vimeoUrl: process.env.NEXT_PUBLIC_VIMEO_URL ?? "",
  schedulingUrl: process.env.NEXT_PUBLIC_SCHEDULING_URL ?? "",
} as const;

export const serviceOptions = [
  "AI-Powered Marketing Strategy",
  "Social Media Marketing",
  "AI Content Creation",
  "SEO and Marketing Automation",
] as const;

export const contactMethods = ["Email", "WhatsApp"] as const;

export function getWhatsAppUrl(message = "Hello Samish Digital Wave, I would like to know more about your digital marketing services.") {
  const rawNumber = siteConfig.whatsappNumber.trim();
  if (!/^\+?[\d\s().-]{8,24}$/.test(rawNumber)) return "";
  const number = rawNumber.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(number)) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getVimeoEmbedUrl() {
  const raw = siteConfig.vimeoUrl.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (!/(^|\.)vimeo\.com$/i.test(url.hostname)) return "";
    const match = url.pathname.match(/\/(\d{6,12})(?:\/([a-zA-Z0-9]+))?/);
    if (!match) return "";
    const hash = match[2] ? `?h=${encodeURIComponent(match[2])}` : "";
    return `https://player.vimeo.com/video/${match[1]}${hash}`;
  } catch {
    return "";
  }
}
