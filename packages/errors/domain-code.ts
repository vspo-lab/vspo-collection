import { z } from "zod";

/**
 * Domain error codes (E + 4 digits)
 *
 * E1xxx - Domain
 * E2xxx - Billing
 * E3xxx - Auth
 * E4xxx - User
 */
export const DomainErrorCodeSchema = z.enum([
  // E1xxx - Domain
  "E1001", // Session expired
  "E1002", // Session not started / not in progress
  "E1003", // Session already completed

  // E2xxx - Billing
  "E2001", // Plan limit exceeded
  "E2002", // Subscription expired

  // E3xxx - Auth
  "E3001", // Verification code expired
  "E3002", // Invalid verification code

  // E4xxx - User
  "E4001", // Onboarding incomplete
  "E4002", // Phone number not verified
]);

export type DomainErrorCode = z.infer<typeof DomainErrorCodeSchema>;

/**
 * Domain code -> HTTP status
 */
export const domainCodeToStatus = (code: DomainErrorCode): number => {
  const prefix = code.slice(1, 2); // "E1001" -> "1"
  switch (prefix) {
    case "1": // Domain
      return 400;
    case "2": // Billing
      return 403;
    case "3": // Auth
      return 400;
    case "4": // User
      return 403;
    default:
      return 400;
  }
};

/**
 * Returns whether the input is a valid domain error code
 */
export const isDomainErrorCode = (code: string): code is DomainErrorCode =>
  /^E\d{4}$/.test(code) && DomainErrorCodeSchema.safeParse(code).success;
