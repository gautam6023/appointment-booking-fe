import { useState, useCallback } from "react";
import { validateSingleGuestEmail } from "../utils/formValidation";

interface UseGuestEmailsReturn {
  guestInputs: string[];
  guestErrors: string[];
  addGuest: () => void;
  removeGuest: (index: number) => void;
  updateGuest: (index: number, value: string) => void;
  validateGuest: (index: number, primaryEmail: string) => boolean;
  clearGuests: () => void;
  setGuests: (guests: string[]) => void;
}

/**
 * Custom hook to manage guest email inputs with validation
 */
export function useGuestEmails(initialGuests: string[] = []): UseGuestEmailsReturn {
  const [guestInputs, setGuestInputs] = useState<string[]>(initialGuests);
  const [guestErrors, setGuestErrors] = useState<string[]>([]);

  const addGuest = useCallback(() => {
    setGuestInputs((prev) => [...prev, ""]);
    setGuestErrors((prev) => [...prev, ""]);
  }, []);

  const removeGuest = useCallback((index: number) => {
    setGuestInputs((prev) => prev.filter((_, i) => i !== index));
    setGuestErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateGuest = useCallback((index: number, value: string) => {
    setGuestInputs((prev) => {
      const newGuests = [...prev];
      newGuests[index] = value;
      return newGuests;
    });

    // Clear error for this index when updating
    if (value.trim()) {
      setGuestErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "";
        return newErrors;
      });
    } else {
      setGuestErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "";
        return newErrors;
      });
    }
  }, []);

  const validateGuest = useCallback(
    (index: number, primaryEmail: string): boolean => {
      const guestEmail = guestInputs[index];
      
      if (!guestEmail.trim()) {
        return true; // Empty is valid (optional field)
      }

      const error = validateSingleGuestEmail(
        guestEmail,
        primaryEmail,
        guestInputs,
        index
      );

      setGuestErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = error;
        return newErrors;
      });

      return !error;
    },
    [guestInputs]
  );

  const clearGuests = useCallback(() => {
    setGuestInputs([]);
    setGuestErrors([]);
  }, []);

  const setGuests = useCallback((guests: string[]) => {
    setGuestInputs(guests);
    setGuestErrors(guests.map(() => ""));
  }, []);

  return {
    guestInputs,
    guestErrors,
    addGuest,
    removeGuest,
    updateGuest,
    validateGuest,
    clearGuests,
    setGuests,
  };
}

