import { createSubmissionReceipt } from "@/lib/receipt";
import { validateConsultation, type ConsultationInput } from "@/lib/validation";

export const runtime = "nodejs";

type RateLimitEntry = { count: number; expiresAt: number };
const rateLimit = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || "unknown";
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 120);
}

async function sendResendEmail(apiKey: string, message: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from: message.from,
      to: [message.to],
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      subject: message.subject,
      text: message.text,
    }),
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });

  if (!response.ok) return false;
  const result = (await response.json().catch(() => null)) as { id?: string } | null;
  return typeof result?.id === "string" && result.id.length > 0;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) return json({ error: "The submitted form is too large." }, 413);

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) return json({ error: "The request could not be verified." }, 403);
    } catch {
      return json({ error: "The request could not be verified." }, 403);
    }
  }

  const key = getRateLimitKey(request);
  const now = Date.now();
  const currentLimit = rateLimit.get(key);
  if (rateLimit.size > 1_000) {
    for (const [entryKey, entry] of rateLimit) {
      if (entry.expiresAt <= now) rateLimit.delete(entryKey);
    }
  }
  if (currentLimit && currentLimit.expiresAt > now && currentLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return json({ error: "Too many requests. Please wait a little before trying again." }, 429);
  }
  if (!currentLimit || currentLimit.expiresAt <= now) rateLimit.set(key, { count: 1, expiresAt: now + WINDOW_MS });
  else rateLimit.set(key, { ...currentLimit, count: currentLimit.count + 1 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "Please submit the form again." }, 400);
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return json({ error: "Please submit the form again." }, 400);
  const candidate = raw as Record<string, unknown>;
  if (candidate.websiteUrl !== undefined && (typeof candidate.websiteUrl !== "string" || candidate.websiteUrl.trim())) {
    return json({ error: "We could not verify this request." }, 400);
  }

  const submittedStringFields = ["fullName", "businessEmail", "company", "website", "whatsappNumber", "country", "service", "challenge", "contactMethod"] as const;
  const malformedField = submittedStringFields.find((field) => candidate[field] !== undefined && typeof candidate[field] !== "string");
  if (malformedField) {
    return json({
      error: "Please check the highlighted fields and try again.",
      errors: { [malformedField]: "Enter a valid value." },
    }, 422);
  }
  if (candidate.consent !== undefined && typeof candidate.consent !== "boolean") {
    return json({ error: "Please confirm that I may contact you about this request.", errors: { consent: "Please confirm your consent." } }, 422);
  }

  const input: ConsultationInput = {
    fullName: typeof candidate.fullName === "string" ? candidate.fullName : "",
    businessEmail: typeof candidate.businessEmail === "string" ? candidate.businessEmail : "",
    company: typeof candidate.company === "string" ? candidate.company : "",
    website: typeof candidate.website === "string" ? candidate.website : "",
    whatsappNumber: typeof candidate.whatsappNumber === "string" ? candidate.whatsappNumber : "",
    country: typeof candidate.country === "string" ? candidate.country : "",
    service: typeof candidate.service === "string" ? candidate.service : "",
    challenge: typeof candidate.challenge === "string" ? candidate.challenge : "",
    contactMethod: typeof candidate.contactMethod === "string" ? candidate.contactMethod : "",
    consent: candidate.consent === true,
  };

  const errors = validateConsultation(input);
  if (Object.keys(errors).length) return json({ error: "Please check the highlighted fields and try again.", errors }, 422);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) return json({ error: "Please refresh the page and submit the form again." }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  const to = process.env.LEADS_TO_EMAIL;
  const tokenSecret = process.env.SUBMISSION_TOKEN_SECRET;
  if (!apiKey || !from || !to || !tokenSecret || tokenSecret.length < 32) {
    return json({ error: "The consultation form is not connected yet. Please check back later." }, 503);
  }

  const fromAddress = from.match(/<([^>]+)>/)?.[1] ?? from;
  const fromDomain = fromAddress.toLowerCase().split("@")[1];
  if (!isEmail(to) || !isEmail(fromAddress) || fromDomain !== "consultation.samish.com.np") {
    return json({ error: "The consultation form is not configured correctly. Please try again later." }, 503);
  }

  const subject = cleanHeader(`Consultation request from ${input.fullName}`);
  const text = [
    "New Samish Digital Wave consultation request",
    "",
    `Full name: ${input.fullName.trim()}`,
    `Business email: ${input.businessEmail.trim()}`,
    `Company or brand: ${input.company.trim() || "Not provided"}`,
    `Website or social media: ${input.website.trim() || "Not provided"}`,
    `WhatsApp number: ${input.whatsappNumber.trim() || "Not provided"}`,
    `Country: ${input.country.trim()}`,
    `Service of interest: ${input.service}`,
    `Preferred contact: ${input.contactMethod}`,
    "",
    "Main marketing challenge:",
    input.challenge.trim(),
  ].join("\n");

  try {
    const ownerNotified = await sendResendEmail(apiKey, {
      from,
      to,
      replyTo: input.businessEmail.trim(),
      subject,
      text,
      idempotencyKey: `${idempotencyKey}:owner`,
    });
    if (!ownerNotified) return json({ error: "We couldn’t send your request just now. Please try again shortly." }, 502);

    const buyerConfirmed = await sendResendEmail(apiKey, {
      from,
      to: input.businessEmail.trim(),
      subject: "We received your consultation request",
      text: [
        `Hi ${input.fullName.trim()},`,
        "",
        "Thanks for requesting a Samish Digital Wave consultation. We’ve received your details and will follow up using your preferred contact method.",
        "",
        "Your submitted marketing challenge:",
        input.challenge.trim(),
        "",
        "Samish Digital Wave",
      ].join("\n"),
      idempotencyKey: `${idempotencyKey}:buyer`,
    });
    if (!buyerConfirmed) return json({ error: "Your request was received, but we couldn’t send the confirmation email. Please try again shortly." }, 502);

    const receipt = createSubmissionReceipt();
    if (!receipt) return json({ error: "We couldn’t confirm the request. Please try again shortly." }, 503);
    return json({ receipt });
  } catch {
    return json({ error: "The submission service is temporarily unavailable. Please try again shortly." }, 502);
  }
}
