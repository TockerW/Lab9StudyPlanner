import { useState } from 'react';
import Pagination from '../components/Pagination';
import TaskFilters from '../components/TaskFilters';
import TaskFormDialog from '../components/TaskFormDialog';
import TaskList from '../components/TaskList';
import TaskStats from '../components/TaskStats';
import { PAGE_SIZE } from '../constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTasks } from '../hooks/useTasks';
import type { TaskFormData } from '../schemas/taskSchema';
import { filterTasks, getTaskCounts } from '../utils/taskSelectors';
import './TasksPage.scss';

function TasksPage() {
  // Фільтри та сторінка — з URL (query params)
  const { status: statusFilter, priority, page, setStatus, setPriority, setPage } =
    useTaskFilters();
  // Client/UI state: чи відкритий діалог створення
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const requireAuth = useRequireAuth();

  // Server state: дані з API та операції над ними
  const {
    status: loadStatus,
    tasks,
    total,
    error,
    busyIds,
    reload,
    createTask,
    toggleTask,
    deleteTask,
  } = useTasks(page);

  // Derived state: обчислюється під час render
  const counts = getTaskCounts(tasks);
  const visibleTasks = filterTasks(tasks, statusFilter, priority);

  useDocumentTitle(
    `Study Planner — ${counts.active} active ${counts.active === 1 ? 'task' : 'tasks'}`,
  );

  // Захищена дія: спочатку перевірка авторизації, потім відкриття діалогу
  const handleAddClick = () => {
    if (requireAuth()) setIsCreateOpen(true);
  };

  const handleCreate = async (data: TaskFormData) => {
    await createTask(data);
    // Нові завдання показуються на початку першої сторінки
    if (page !== 1) setPage(1);
  };

  const handleDelete = async (id: number) => {
    const removed = await deleteTask(id);
    // Якщо видалили останнє завдання на сторінці — повертаємось назад
    if (removed && tasks.length === 1 && page > 1) setPage(page - 1);
  };

  return (
    <section className="tasks-page">
      <div className="tasks-page__header">
        <h2 className="tasks-page__title">Завдання</h2>
        <button
          type="button"
          className="tasks-page__add"
          onClick={handleAddClick}
          aria-label="Створити завдання"
          title="Створити завдання"
        >
          +
        </button>
      </div>

      <TaskStats total={total} pageCompleted={counts.completed} pageActive={counts.active} />
      <TaskFilters
        status={statusFilter}
        priority={priority}
        counts={{ all: counts.total, completed: counts.completed, active: counts.active }}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
      />
      <TaskList
        status={loadStatus}
        errorMessage={error}
        tasks={visibleTasks}
        hasAnyTasks={tasks.length > 0}
        busyIds={busyIds}
        onRetry={reload}
        onToggle={toggleTask}
        onDelete={handleDelete}
      />
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />

      <TaskFormDialog
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}

export default TasksPage;
