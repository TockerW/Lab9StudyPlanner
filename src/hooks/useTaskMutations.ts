import { useCallback, useMemo } from 'react';
import type { TaskPatch } from '../repositories/sessionOverlay';
import { taskRepository } from '../repositories/taskRepository';
import type { TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

 // Захищені операції над завданнями (Authorization: Bearer додає httpClient)
 // Помилки не перехоплюються: їх обробляє той, хто викликає (діалог чи Toast)

export function useTaskMutations() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const create = useCallback(
    async (data: TaskFormData): Promise<Task> => {
      const task = await taskRepository.create({
        ...data,
        createdBy: user?.username ?? 'unknown',
      });
      showToast(`Завдання «${task.title}» створено.`);
      return task;
    },
    [user, showToast],
  );

  const update = useCallback(
    async (id: number, patch: TaskPatch, successMessage?: string): Promise<Task> => {
      const task = await taskRepository.update(id, patch);
      if (successMessage) showToast(successMessage);
      return task;
    },
    [showToast],
  );

  const remove = useCallback(
    async (id: number): Promise<void> => {
      await taskRepository.delete(id);
      showToast('Завдання видалено.');
    },
    [showToast],
  );

  return useMemo(() => ({ create, update, remove }), [create, update, remove]);
}
