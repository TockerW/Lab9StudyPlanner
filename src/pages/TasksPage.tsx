import { useState } from 'react';
import Pagination from '../components/Pagination';
import TaskDetails from '../components/TaskDetails';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskStats from '../components/TaskStats';
import { FILTER_STORAGE_KEY, PAGE_SIZE } from '../constants';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTasks } from '../hooks/useTasks';
import type { NewTask, TaskFilter } from '../types/task';
import { filterTasks, getTaskCounts, isTaskFilter } from '../utils/taskSelectors';
import './TasksPage.scss';

function TasksPage() {
  // Client/UI state: сторінка, фільтр, вибране та редаговане завдання.
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useLocalStorage<TaskFilter>(FILTER_STORAGE_KEY, 'all', isTaskFilter);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Server state: дані з API та операції над ними.
  const {
    status,
    tasks,
    total,
    error,
    busyIds,
    revision,
    reload,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks(page);

  // Derived state: обчислюється під час render.
  const counts = getTaskCounts(tasks);
  const visibleTasks = filterTasks(tasks, filter);
  const editingTask = tasks.find((task) => task.id === editingId) ?? null;

  useDocumentTitle(
    `Study Planner — ${counts.active} active ${counts.active === 1 ? 'task' : 'tasks'}`,
  );

  const handleSubmit = async (data: NewTask): Promise<boolean> => {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, data);
      if (updated) setEditingId(null);
      return updated;
    }

    const created = await createTask(data);
    // Нові завдання показуються на початку першої сторінки.
    if (created && page !== 1) setPage(1);
    return created !== null;
  };

  const handleDelete = async (id: number) => {
    const removed = await deleteTask(id);
    if (!removed) return;
    if (selectedId === id) setSelectedId(null);
    if (editingId === id) setEditingId(null);
    // Якщо видалили останнє завдання на сторінці — повертаємось назад.
    if (tasks.length === 1 && page > 1) setPage(page - 1);
  };

  return (
    <main className="tasks-page">
      <div className="tasks-page__side">
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingId(null)}
        />
        {selectedId !== null && (
          <TaskDetails
            taskId={selectedId}
            revision={revision}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <div className="tasks-page__content">
        <TaskStats
          total={total}
          pageCompleted={counts.completed}
          pageActive={counts.active}
        />
        <TaskFilters
          current={filter}
          counts={{ all: counts.total, completed: counts.completed, active: counts.active }}
          onChange={setFilter}
        />
        <TaskList
          status={status}
          errorMessage={error}
          tasks={visibleTasks}
          hasAnyTasks={tasks.length > 0}
          busyIds={busyIds}
          selectedId={selectedId}
          editingId={editingId}
          onRetry={reload}
          onSelect={setSelectedId}
          onToggle={toggleTask}
          onEdit={setEditingId}
          onDelete={handleDelete}
        />
        <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>
    </main>
  );
}

export default TasksPage;
