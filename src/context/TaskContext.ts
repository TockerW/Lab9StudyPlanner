import { createContext } from 'react';
import type { NewTask, Task, TaskFilter } from '../types/task';
import type { ToastMessage } from '../types/toast';

export interface TaskContextValue {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;

  editingTask: Task | null;
  startEditing: (id: number) => void;
  stopEditing: () => void;

  addTask: (data: NewTask) => void;
  updateTask: (id: number, data: NewTask) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;

  pendingDeleteIds: number[];
  pendingDeleteMessage: string | null;

  toast: ToastMessage | null;
  dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
