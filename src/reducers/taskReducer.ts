import { initialTasks } from '../data/initialTasks';
import type { NewTask, Task } from '../types/task';

export interface PendingDeletion {
  ids: number[];
}

export interface TasksState {
  tasks: Task[];
  // Завдання, що очікують остаточного видалення (Undoable Delete)
  pendingDeletion: PendingDeletion | null;
}

export type TaskAction =
  | { type: 'add'; payload: NewTask }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; changes: NewTask } }
  | { type: 'requestDelete'; payload: { ids: number[] } }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset' };

function removeByIds(tasks: Task[], ids: number[]): Task[] {
  return tasks.filter((task) => !ids.includes(task.id));
}

 // Запускає відкладене видалення. Підтримується одне активне видалення:
 // якщо попереднє ще очікує, воно завершується одразу
 
function startDeletion(state: TasksState, ids: number[]): TasksState {
  const tasks = state.pendingDeletion
    ? removeByIds(state.tasks, state.pendingDeletion.ids)
    : state.tasks;
  const existingIds = ids.filter((id) => tasks.some((task) => task.id === id));

  if (existingIds.length === 0) return state;
  return { tasks, pendingDeletion: { ids: existingIds } };
}

// Чиста функція: без таймерів, DOM, localStorage та HTTP
export function taskReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case 'add': {
      const nextId = state.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: nextId, completed: false }],
      };
    }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, completed: !task.completed } : task,
        ),
      };

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.changes } : task,
        ),
      };

    case 'requestDelete':
      return startDeletion(state, action.payload.ids);

    case 'clearCompleted': {
      const completedIds = state.tasks.filter((task) => task.completed).map((task) => task.id);
      return startDeletion(state, completedIds);
    }

    case 'confirmDelete':
      if (!state.pendingDeletion) return state;
      return {
        tasks: removeByIds(state.tasks, state.pendingDeletion.ids),
        pendingDeletion: null,
      };

    case 'undoDelete':
      if (!state.pendingDeletion) return state;
      return { ...state, pendingDeletion: null };

    case 'reset':
      return { tasks: initialTasks, pendingDeletion: null };
  }
}
