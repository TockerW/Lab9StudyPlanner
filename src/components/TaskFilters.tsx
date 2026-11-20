import { useTaskContext } from '../hooks/useTaskContext';
import type { TaskFilter } from '../types/task';
import { getTaskCounts } from '../utils/taskSelectors';
import './TaskFilters.scss';

const options: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
];

function TaskFilters() {
  const { tasks, filter, setFilter, clearCompleted, resetTasks } = useTaskContext();
  const { total, completed, active } = getTaskCounts(tasks);
  const counts: Record<TaskFilter, number> = { all: total, completed, active };

  return (
    <div className="task-filters">
      <div className="task-filters__group" role="group" aria-label="Фільтр завдань">
        {options.map((option) => {
          const isActive = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              className={`task-filters__button${isActive ? ' task-filters__button--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
              <span className="task-filters__count">{counts[option.value]}</span>
            </button>
          );
        })}
      </div>

      <div className="task-filters__actions">
        <button
          type="button"
          className="task-filters__action"
          onClick={clearCompleted}
          disabled={completed === 0}
        >
          Очистити виконані
        </button>
        <button type="button" className="task-filters__action" onClick={resetTasks}>
          Скинути дані
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;
