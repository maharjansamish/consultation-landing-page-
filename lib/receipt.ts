import { createHmac, timingSafeEqual } from "node:crypto";

const RECEIPT_LIFETIME_SECONDS = 15 * 60;

function getSecret() {
  const secret = process.env.SUBMISSION_TOKEN_SECRET;
  return secret && secret.length >= 32 ? secret : "";
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSubmissionReceipt() {
  const secret = getSecret();
  if (!secret) return "";
  const payload = Buffer.from(
    JSON.stringify({ acceptedAt: Date.now(), expiresAt: Date.now() + RECEIPT_LIFETIME_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function isValidSubmissionReceipt(token: string | undefined) {
  const secret = getSecret();
  if (!secret || !token || token.length > 512) return false;
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return false;

  const expected = Buffer.from(signature(payload, secret));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number };
    return typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}
