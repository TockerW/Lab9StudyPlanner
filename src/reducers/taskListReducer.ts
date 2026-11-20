import type { Task } from '../types/task';

export type LoadStatus = 'loading' | 'success' | 'error';

/** Server state: дані, отримані через API, та стан їх завантаження. */
export interface TaskListState {
  status: LoadStatus;
  tasks: Task[];
  total: number;
  error: string | null;
  /** id завдань, для яких зараз виконується mutation-запит. */
  busyIds: number[];
  /** Збільшується після кожної зміни списку; потрібен для оновлення деталей. */
  revision: number;
}

export type TaskListAction =
  | { type: 'fetchStart' }
  | { type: 'fetchSuccess'; payload: { tasks: Task[]; total: number } }
  | { type: 'fetchError'; payload: { message: string } }
  | { type: 'taskAdded'; payload: { task: Task } }
  | { type: 'taskUpdated'; payload: { task: Task } }
  | { type: 'taskRemoved'; payload: { id: number } }
  | { type: 'busyStart'; payload: { id: number } }
  | { type: 'busyEnd'; payload: { id: number } };

export const initialTaskListState: TaskListState = {
  status: 'loading',
  tasks: [],
  total: 0,
  error: null,
  busyIds: [],
  revision: 0,
};

export function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
  switch (action.type) {
    case 'fetchStart':
      return { ...state, status: 'loading', error: null };

    case 'fetchSuccess':
      return {
        ...state,
        status: 'success',
        tasks: action.payload.tasks,
        total: action.payload.total,
        error: null,
      };

    case 'fetchError':
      return { ...state, status: 'error', error: action.payload.message };

    case 'taskAdded':
      return {
        ...state,
        tasks: [action.payload.task, ...state.tasks],
        total: state.total + 1,
        revision: state.revision + 1,
      };

    case 'taskUpdated':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.task.id ? action.payload.task : task,
        ),
        revision: state.revision + 1,
      };

    case 'taskRemoved':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        total: Math.max(0, state.total - 1),
        busyIds: state.busyIds.filter((id) => id !== action.payload.id),
        revision: state.revision + 1,
      };

    case 'busyStart':
      return { ...state, busyIds: [...state.busyIds, action.payload.id] };

    case 'busyEnd':
      return { ...state, busyIds: state.busyIds.filter((id) => id !== action.payload.id) };
  }
}
