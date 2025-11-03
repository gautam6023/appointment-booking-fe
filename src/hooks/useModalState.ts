import { useState, useCallback } from "react";

interface UseModalStateReturn<T> {
  isOpen: boolean;
  selectedItem: T | null;
  open: (item?: T) => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Generic hook for managing modal/drawer state with selected item
 */
export function useModalState<T = unknown>(
  initialOpen = false
): UseModalStateReturn<T> {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const open = useCallback((item?: T) => {
    setIsOpen(true);
    if (item !== undefined) {
      setSelectedItem(item);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    selectedItem,
    open,
    close,
    toggle,
  };
}

