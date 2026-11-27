import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/errors';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export type TaskDetailsState =
  | { status: 'loading' }
  | { status: 'success'; task: Task }
  | { status: 'error'; message: string };

// Локальний state сторінки деталей: GET за id зі скасуванням попереднього запиту
export function useTaskDetails(taskId: number) {
  const [state, setState] = useState<TaskDetailsState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // Під час повторного завантаження того ж завдання показуємо наявні дані
    setState((previous) =>
      previous.status === 'success' && previous.task.id === taskId
        ? previous
        : { status: 'loading' },
    );

    taskRepository
      .getById(taskId, controller.signal)
      .then((task) => setState({ status: 'success', task }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [taskId, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { state, reload };
}
