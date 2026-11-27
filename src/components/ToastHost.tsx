import { TOAST_DURATION_MS } from '../constants';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';
import './ToastHost.scss';

function ToastHost() {
  const { toast, dismissToast } = useToast();

  return (
    <div className="toast-host" aria-live="polite">
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          durationMs={TOAST_DURATION_MS}
          onClose={dismissToast}
        />
      )}
    </div>
  );
}

export default ToastHost;
