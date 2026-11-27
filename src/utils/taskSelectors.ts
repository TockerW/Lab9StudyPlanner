import type { PriorityFilter, Task, TaskFilter } from '../types/task';

export function isTaskFilter(value: unknown): value is TaskFilter {
  return value === 'all' || value === 'completed' || value === 'active';
}

export function isPriorityFilter(value: unknown): value is PriorityFilter {
  return value === 'all' || value === 'low' || value === 'medium' || value === 'high';
}

/** Похідні дані: обчислюються під час render, а не в useEffect і не в state. */
export function getTaskCounts(tasks: Task[]) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, completed, active: tasks.length - completed };
}

export function filterTasks(
  tasks: Task[],
  status: TaskFilter,
  priority: PriorityFilter,
): Task[] {
  return tasks.filter((task) => {
    if (status === 'completed' && !task.completed) return false;
    if (status === 'active' && task.completed) return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    return true;
  });
}
