// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== IMPORT UTILITIES =====

/**
 * Normalize phone number to consistent format
 * Formats US numbers as (XXX) XXX-XXXX
 */
export function normalizePhone(phone: string | undefined): string | null {
  if (!phone) return null;

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 7) return null;

  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Handle numbers with leading 1 (US country code)
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return as-is for international numbers
  return digits;
}

/**
 * Normalize website URL to consistent format
 * Ensures https:// protocol and removes trailing slashes
 */
export function normalizeWebsite(url: string | undefined): string | null {
  if (!url) return null;

  let normalized = url.trim().toLowerCase();

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, "");

  // Add https:// if no protocol
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = "https://" + normalized;
  }

  return normalized;
}
