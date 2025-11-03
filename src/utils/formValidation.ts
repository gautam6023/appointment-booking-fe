/**
 * Validates a list of guest emails against the primary email and checks for duplicates
 */
export function validateGuestEmails(
  guestEmails: string[],
  primaryEmail: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seen = new Set<string>();
  const primaryLower = primaryEmail.toLowerCase().trim();

  guestEmails.forEach((email, index) => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      return; // Skip empty emails
    }

    // Check if guest email matches primary email
    if (trimmed === primaryLower) {
      errors[index] = "Guest email cannot be the same as primary email";
      return;
    }

    // Check for duplicates
    if (seen.has(trimmed)) {
      errors[index] = "This email is already added as a guest";
      return;
    }

    seen.add(trimmed);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if there are duplicate emails in a list
 */
export function hasDuplicateEmails(emails: string[]): boolean {
  const seen = new Set<string>();
  for (const email of emails) {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && seen.has(trimmed)) {
      return true;
    }
    if (trimmed) {
      seen.add(trimmed);
    }
  }
  return false;
}

/**
 * Sanitizes and filters guest email inputs
 * Removes empty strings and trims whitespace
 */
export function sanitizeGuestEmails(guestInputs: string[]): string[] {
  return guestInputs
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

/**
 * Validates a single guest email against primary and existing guests
 */
export function validateSingleGuestEmail(
  guestEmail: string,
  primaryEmail: string,
  existingGuests: string[],
  currentIndex?: number
): string {
  const trimmed = guestEmail.trim().toLowerCase();
  const primaryLower = primaryEmail.toLowerCase();

  if (!trimmed) {
    return "";
  }

  // Check against primary email
  if (trimmed === primaryLower) {
    return "Guest email cannot be the same as primary email";
  }

  // Check for duplicates in existing guests
  const duplicateIndex = existingGuests.findIndex(
    (email, i) => i !== currentIndex && email.trim().toLowerCase() === trimmed
  );

  if (duplicateIndex !== -1) {
    return "This email is already added as a guest";
  }

  return "";
}

