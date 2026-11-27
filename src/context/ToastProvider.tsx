import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ToastMessage, ToastVariant } from '../types/toast';
import { ToastContext } from './ToastContext';
import type { ToastContextValue } from './ToastContext';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, variant });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo<ToastContextValue>(
    () => ({ toast, showToast, dismissToast }),
    [toast, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
