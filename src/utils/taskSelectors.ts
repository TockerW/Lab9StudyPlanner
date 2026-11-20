import type { Task, TaskFilter } from '../types/task';

export function isTaskFilter(value: unknown): value is TaskFilter {
  return value === 'all' || value === 'completed' || value === 'active';
}

// Похідні дані: обчислюються під час render, а не в useEffect і не в state
export function getTaskCounts(tasks: Task[]) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, completed, active: tasks.length - completed };
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'completed') return tasks.filter((task) => task.completed);
  if (filter === 'active') return tasks.filter((task) => !task.completed);
  return tasks;
}
