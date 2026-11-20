export type Priority = 'low' | 'medium' | 'high';

export type TaskFilter = 'all' | 'completed' | 'active';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

/** Дані, які вводить користувач у формі (id та completed задає застосунок). */
export type NewTask = Omit<Task, 'id' | 'completed'>;
