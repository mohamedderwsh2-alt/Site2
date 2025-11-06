import crypto from "node:crypto";

export const generateReferralCode = () => {
  const bytes = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `CB${bytes}`;
};

export const sanitizeReferralCode = (code?: string | null) =>
  code?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
