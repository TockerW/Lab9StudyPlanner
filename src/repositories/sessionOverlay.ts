import type { Task } from '../types/task';

 // DummyJSON лише імітує POST / PUT / DELETE: зміни на сервері не зберігаються,
 // а створений todo неможливо потім отримати (404)
 // Щоб інтерфейс був послідовним, repository запам’ятовує успішні зміни
 // на час сесії (у пам’яті). Для реального API цей файл не потрібен
 
export type TaskPatch = Partial<Omit<Task, 'id'>>;

const created = new Map<number, Task>();
const patches = new Map<number, TaskPatch>();
const deleted = new Set<number>();

export const sessionOverlay = {
  // Унікальний id: API щоразу повертає той самий id для нових todo
  uniqueId(apiId: number): number {
    let id = apiId;
    while (created.has(id)) id += 1;
    return id;
  },

  addCreated(task: Task) {
    created.set(task.id, task);
  },

  getCreated(id: number): Task | undefined {
    return created.get(id);
  },

  // Створені завдання, найновіші першими
  listCreated(): Task[] {
    return [...created.values()].reverse();
  },

  createdCount(): number {
    return created.size;
  },

  deletedCount(): number {
    return deleted.size;
  },

  isDeleted(id: number): boolean {
    return deleted.has(id);
  },

  patch(id: number, patch: TaskPatch) {
    const existing = created.get(id);
    if (existing) {
      created.set(id, { ...existing, ...patch });
    } else {
      patches.set(id, { ...patches.get(id), ...patch });
    }
  },

  remove(id: number) {
    if (!created.delete(id)) {
      deleted.add(id);
      patches.delete(id);
    }
  },

  // Накладає локальні зміни на завдання, отримане з API
  apply(task: Task): Task {
    return { ...task, ...patches.get(task.id) };
  },
};
