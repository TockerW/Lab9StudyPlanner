import { TOAST_DURATION_MS, UNDO_DELAY_MS } from '../constants';
import { useTaskContext } from '../hooks/useTaskContext';
import Toast from './Toast';
import './ToastHost.scss';

function ToastHost() {
  const { toast, dismissToast, pendingDeleteIds, pendingDeleteMessage, undoDelete } =
    useTaskContext();

  return (
    <div className="toast-host" aria-live="polite">
      {pendingDeleteMessage && (
        <Toast
          key={`pending-${pendingDeleteIds.join('-')}`}
          message={pendingDeleteMessage}
          variant="info"
          durationMs={UNDO_DELAY_MS}
          showProgress
          actionLabel="Скасувати"
          onAction={undoDelete}
        />
      )}
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
