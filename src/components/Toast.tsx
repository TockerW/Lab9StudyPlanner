import { useEffect } from 'react';
import type { ToastVariant } from '../types/toast';
import './Toast.scss';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  durationMs: number;
  onClose: () => void;
}

function Toast({ message, variant = 'success', durationMs, onClose }: ToastProps) {
  // Toast зникає сам; cleanup скасовує таймер при unmount або заміні повідомлення.
  useEffect(() => {
    const timerId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timerId);
  }, [onClose, durationMs]);

  return (
    <div className={`toast toast--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <p className="toast__message">{message}</p>
    </div>
  );
}

export default Toast;
