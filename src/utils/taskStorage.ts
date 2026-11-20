import { TASKS_STORAGE_KEY } from '../constants';
import type { Task } from '../types/task';

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.category === 'string' &&
    (task.priority === 'low' || task.priority === 'medium' || task.priority === 'high')
  );
}

// Повертає збережені завдання або null, якщо даних немає чи вони пошкоджені
export function loadTasks(): Task[] | null {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isTask) ? parsed : null;
  } catch {
    return null;
  }
}

// Повертає false, якщо записати дані не вдалося (квота, приватний режим тощо)
export function saveTasks(tasks: Task[]): boolean {
  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
