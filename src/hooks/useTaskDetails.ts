import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/errors';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export type TaskDetailsState =
  | { status: 'loading' }
  | { status: 'success'; task: Task }
  | { status: 'error'; message: string };

/** Локальний state деталей: окремий GET за id зі скасуванням попереднього запиту. */
export function useTaskDetails(taskId: number, revision: number) {
  const [state, setState] = useState<TaskDetailsState>({ status: 'loading' });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    taskRepository
      .getById(taskId, controller.signal)
      .then((task) => setState({ status: 'success', task }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [taskId, revision, retryKey]);

  const retry = useCallback(() => setRetryKey((key) => key + 1), []);

  return { state, retry };
}
