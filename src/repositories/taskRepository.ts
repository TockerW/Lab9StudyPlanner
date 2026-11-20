import { httpClient } from '../api/httpClient';
import { HttpError } from '../api/errors';
import type { ApiTodo, TodosResponse } from '../types/api';
import type { NewTask, Task } from '../types/task';
import { sessionOverlay } from './sessionOverlay';
import type { TaskPatch } from './sessionOverlay';

const TODOS_PATH = '/todos';
/** DummyJSON вимагає userId при створенні todo. */
const CURRENT_USER_ID = 1;

export interface TaskPage {
  tasks: Task[];
  total: number;
}

export interface PageParams {
  limit: number;
  skip: number;
}

/** DTO → domain. Поля, яких немає в API, лишаються client-only значеннями за замовчуванням. */
function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
  };
}

/** Repository ховає endpoint-и, формат DTO та mapping від UI. */
export const taskRepository = {
  async getAll({ limit, skip }: PageParams, signal?: AbortSignal): Promise<TaskPage> {
    const data = await httpClient.get<TodosResponse>(TODOS_PATH, {
      query: { limit, skip },
      signal,
    });

    const apiTasks = data.todos
      .filter((todo) => !sessionOverlay.isDeleted(todo.id))
      .map((todo) => sessionOverlay.apply(toTask(todo)));
    // Створені в цій сесії завдання показуємо на початку першої сторінки.
    const createdTasks = skip === 0 ? sessionOverlay.listCreated() : [];

    return {
      tasks: [...createdTasks, ...apiTasks],
      total: data.total - sessionOverlay.deletedCount() + sessionOverlay.createdCount(),
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const createdTask = sessionOverlay.getCreated(id);
    if (createdTask) return createdTask;
    if (sessionOverlay.isDeleted(id)) throw new HttpError(404, 'Not Found');

    const todo = await httpClient.get<ApiTodo>(`${TODOS_PATH}/${id}`, { signal });
    return sessionOverlay.apply(toTask(todo));
  },

  async create(input: NewTask): Promise<Task> {
    const todo = await httpClient.post<ApiTodo>(`${TODOS_PATH}/add`, {
      todo: input.title,
      completed: false,
      userId: CURRENT_USER_ID,
    });

    const task: Task = {
      ...toTask(todo),
      id: sessionOverlay.uniqueId(todo.id),
      description: input.description,
      priority: input.priority,
      category: input.category,
    };
    sessionOverlay.addCreated(task);
    return task;
  },

  async update(id: number, patch: TaskPatch): Promise<Task> {
    // Створені локально todo на сервері не існують (DummyJSON відповів би 404).
    const createdTask = sessionOverlay.getCreated(id);
    if (createdTask) {
      sessionOverlay.patch(id, patch);
      return { ...createdTask, ...patch };
    }

    const todo = await httpClient.put<ApiTodo>(`${TODOS_PATH}/${id}`, {
      todo: patch.title,
      completed: patch.completed,
    });
    sessionOverlay.patch(id, patch);
    return sessionOverlay.apply(toTask(todo));
  },

  async delete(id: number): Promise<void> {
    if (!sessionOverlay.getCreated(id)) {
      await httpClient.delete<ApiTodo>(`${TODOS_PATH}/${id}`);
    }
    sessionOverlay.remove(id);
  },
};
