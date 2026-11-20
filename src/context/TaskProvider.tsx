import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FILTER_STORAGE_KEY, UNDO_DELAY_MS } from '../constants';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { taskReducer } from '../reducers/taskReducer';
import type { TasksState } from '../reducers/taskReducer';
import type { NewTask, TaskFilter } from '../types/task';
import type { ToastMessage, ToastVariant } from '../types/toast';
import { isTaskFilter } from '../utils/taskSelectors';
import { loadTasks, saveTasks } from '../utils/taskStorage';
import { TaskContext } from './TaskContext';
import type { TaskContextValue } from './TaskContext';

// Початковий state: збережені завдання або стартовий список
function createInitialState(): TasksState {
  return { tasks: loadTasks() ?? initialTasks, pendingDeletion: null };
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [{ tasks, pendingDeletion }, dispatch] = useReducer(
    taskReducer,
    undefined,
    createInitialState,
  );
  const [filter, setFilter] = useLocalStorage<TaskFilter>(
    FILTER_STORAGE_KEY,
    'all',
    isTaskFilter,
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const nextToastId = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    nextToastId.current += 1;
    setToast({ id: nextToastId.current, message, variant });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // Effect 1: синхронізація tasks з localStorage (reducer лишається чистим)
  useEffect(() => {
    if (!saveTasks(tasks)) {
      showToast('Не вдалося зберегти дані в браузері.', 'error');
    }
  }, [tasks, showToast]);

  // Effect 2: таймер Undoable Delete. Запуск і cleanup — тільки тут, не в reducer
  useEffect(() => {
    if (!pendingDeletion) return;

    const count = pendingDeletion.ids.length;
    const timerId = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete' });
      showToast(count === 1 ? 'Завдання видалено.' : `Видалено завдань: ${count}.`);
    }, UNDO_DELAY_MS);

    // Cleanup: Undo, нове видалення або unmount скасовують попередній таймер
    return () => window.clearTimeout(timerId);
  }, [pendingDeletion, showToast]);

  const startEditing = useCallback((id: number) => setEditingTaskId(id), []);
  const stopEditing = useCallback(() => setEditingTaskId(null), []);

  const addTask = useCallback(
    (data: NewTask) => {
      dispatch({ type: 'add', payload: data });
      showToast(`Завдання «${data.title}» створено.`);
    },
    [showToast],
  );

  const updateTask = useCallback(
    (id: number, data: NewTask) => {
      dispatch({ type: 'update', payload: { id, changes: data } });
      showToast('Зміни збережено.');
    },
    [showToast],
  );

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } });
  }, []);

  const requestDelete = useCallback(
    (id: number) => {
      if (!tasks.some((task) => task.id === id)) {
        showToast('Не вдалося видалити: завдання не знайдено.', 'error');
        return;
      }
      setEditingTaskId((current) => (current === id ? null : current));
      dispatch({ type: 'requestDelete', payload: { ids: [id] } });
    },
    [tasks, showToast],
  );

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' });
    showToast('Видалення скасовано.', 'info');
  }, [showToast]);

  const clearCompleted = useCallback(() => {
    if (!tasks.some((task) => task.completed)) {
      showToast('Немає виконаних завдань для очищення.', 'error');
      return;
    }
    dispatch({ type: 'clearCompleted' });
  }, [tasks, showToast]);

  const resetTasks = useCallback(() => {
    setEditingTaskId(null);
    dispatch({ type: 'reset' });
    showToast('Дані скинуто до початкових.', 'info');
  }, [showToast]);

  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;
  const pendingDeleteIds = useMemo(() => pendingDeletion?.ids ?? [], [pendingDeletion]);

  let pendingDeleteMessage: string | null = null;
  if (pendingDeletion) {
    const [firstId] = pendingDeletion.ids;
    const title = tasks.find((task) => task.id === firstId)?.title ?? '';
    pendingDeleteMessage =
      pendingDeletion.ids.length === 1
        ? `Завдання «${title}» буде видалено.`
        : `Буде видалено завдань: ${pendingDeletion.ids.length}.`;
  }

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      filter,
      setFilter,
      editingTask,
      startEditing,
      stopEditing,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      pendingDeleteIds,
      pendingDeleteMessage,
      toast,
      dismissToast,
    }),
    [
      tasks,
      filter,
      setFilter,
      editingTask,
      startEditing,
      stopEditing,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      pendingDeleteIds,
      pendingDeleteMessage,
      toast,
      dismissToast,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
