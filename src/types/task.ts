export type Priority = 'low' | 'medium' | 'high';

// Фільтр за станом виконання
export type TaskFilter = 'all' | 'completed' | 'active';

// Фільтр за пріоритетом
export type PriorityFilter = Priority | 'all';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;

   // Client-owned metadata: DummyJSON не надає цих полів, ними володіє клієнт
   // createdBy — username користувача, який створив завдання у цій сесії
   // (для завдань із сервера — "User #<userId>")
   // createdAt — ISO-дата створення; null, якщо дата невідома (завдання з сервера)
   
  createdBy: string;
  createdAt: string | null;
}

// Поля, які користувач вводить у формі завдання
export type NewTask = Pick<Task, 'title' | 'description' | 'category' | 'priority'>;

export interface CreateTaskInput extends NewTask {
  createdBy: string;
}
