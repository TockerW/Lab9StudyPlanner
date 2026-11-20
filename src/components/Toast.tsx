import { useEffect } from 'react';
import type { ToastVariant } from '../types/toast';
import './Toast.scss';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  durationMs: number;
  /** Якщо передано — Toast сам зникає через durationMs. */
  onClose?: () => void;
  showProgress?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

function Toast({
  message,
  variant = 'success',
  durationMs,
  onClose,
  showProgress = false,
  actionLabel,
  onAction,
}: ToastProps) {
  useEffect(() => {
    if (!onClose) return;
    const timerId = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timerId);
  }, [onClose, durationMs]);

  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <div className="toast__content">
        <p className="toast__message">{message}</p>
        {actionLabel && onAction && (
          <button type="button" className="toast__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {showProgress && (
        <div className="toast__progress" aria-hidden="true">
          <div
            className="toast__progress-bar"
            style={{ animationDuration: `${durationMs}ms` }}
          />
        </div>
      )}
    </div>
  );
}

export default Toast;
