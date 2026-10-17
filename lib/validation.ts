import { contactMethods, serviceOptions } from "@/lib/site-config";

export type ConsultationInput = {
  fullName: string;
  businessEmail: string;
  company: string;
  website: string;
  whatsappNumber: string;
  country: string;
  service: string;
  challenge: string;
  contactMethod: string;
  consent: boolean;
  websiteUrl?: string;
};

export type FieldErrors = Partial<Record<keyof ConsultationInput, string>>;

export function validateConsultation(input: ConsultationInput): FieldErrors {
  const errors: FieldErrors = {};
  const email = input.businessEmail.trim();

  if (!input.fullName.trim()) errors.fullName = "Enter your name.";
  else if (input.fullName.trim().length > 120) errors.fullName = "Keep your name under 120 characters.";

  if (!email) errors.businessEmail = "Enter your business email.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.businessEmail = "Enter a valid email address.";
  }

  if (input.company.trim().length > 160) errors.company = "Keep the company name under 160 characters.";
  if (input.website.trim() && !isValidWebUrl(input.website.trim())) {
    errors.website = "Enter a valid website or social media URL, including https://.";
  }

  const phoneDigits = input.whatsappNumber.replace(/\D/g, "");
  if (input.contactMethod === "WhatsApp" && !/^\+?[\d\s().-]{8,24}$/.test(input.whatsappNumber.trim())) {
    errors.whatsappNumber = "Enter a WhatsApp number with its country code.";
  } else if (input.whatsappNumber.trim() && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
    errors.whatsappNumber = "Enter a valid international phone number.";
  }

  if (!input.country.trim()) errors.country = "Enter your country.";
  else if (input.country.trim().length > 100) errors.country = "Keep the country under 100 characters.";

  if (!serviceOptions.includes(input.service as (typeof serviceOptions)[number])) {
    errors.service = "Choose a service area.";
  }

  if (!input.challenge.trim()) errors.challenge = "Tell me a little about your main challenge.";
  else if (input.challenge.trim().length > 3000) errors.challenge = "Keep your message under 3,000 characters.";

  if (!contactMethods.includes(input.contactMethod as (typeof contactMethods)[number])) {
    errors.contactMethod = "Choose Email or WhatsApp.";
  }

  if (input.consent !== true) errors.consent = "Please confirm that I may contact you about this request.";

  return errors;
}

export function isValidWebUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}
