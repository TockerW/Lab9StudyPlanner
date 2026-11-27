import { useCallback, useEffect, useReducer, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/errors';
import { PAGE_SIZE } from '../constants';
import { initialTaskListState, taskListReducer } from '../reducers/taskListReducer';
import { taskRepository } from '../repositories/taskRepository';
import type { TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';
import { useTaskMutations } from './useTaskMutations';
import { useToast } from './useToast';

 // Server state списку завдань: завантаження сторінки, CRUD та стани loading/success/error
 // Компоненти не знають про HTTP — працюють лише з цим hook
 
export function useTasks(page: number) {
  const [state, dispatch] = useReducer(taskListReducer, initialTaskListState);
  const [reloadKey, setReloadKey] = useState(0);
  const { showToast } = useToast();
  const { create, update, remove } = useTaskMutations();

  // Завантаження сторінки. При зміні page або повторі попередній запит скасовується
  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'fetchStart' });

    taskRepository
      .getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }, controller.signal)
      .then(({ tasks, total }) => {
        dispatch({ type: 'fetchSuccess', payload: { tasks, total } });
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return; // скасований запит — не помилка для користувача
        dispatch({ type: 'fetchError', payload: { message: getErrorMessage(error) } });
      });

    return () => controller.abort();
  }, [page, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  // Mutation над існуючим завданням: busy-стан та Toast при помилці

  const runForTask = useCallback(
    async <T>(id: number, operation: () => Promise<T>): Promise<T | null> => {
      dispatch({ type: 'busyStart', payload: { id } });
      try {
        return await operation();
      } catch (error) {
        showToast(getErrorMessage(error), 'error');
        return null;
      } finally {
        dispatch({ type: 'busyEnd', payload: { id } });
      }
    },
    [showToast],
  );

  // Кидає помилку, якщо не вдалося: її покаже TaskFormDialog
  const createTask = useCallback(
    async (data: TaskFormData): Promise<void> => {
      const task = await create(data);
      dispatch({ type: 'taskAdded', payload: { task } });
    },
    [create],
  );

  const toggleTask = useCallback(
    async (task: Task): Promise<void> => {
      const updated = await runForTask(task.id, () =>
        update(task.id, { completed: !task.completed }),
      );
      if (updated) dispatch({ type: 'taskUpdated', payload: { task: updated } });
    },
    [runForTask, update],
  );

  const deleteTask = useCallback(
    async (id: number): Promise<boolean> => {
      const removed = await runForTask(id, async () => {
        await remove(id);
        return true;
      });
      if (!removed) return false;
      dispatch({ type: 'taskRemoved', payload: { id } });
      return true;
    },
    [runForTask, remove],
  );

  return { ...state, reload, createTask, toggleTask, deleteTask };
}
