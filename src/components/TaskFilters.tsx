import type { PriorityFilter, TaskFilter } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
  status: TaskFilter;
  priority: PriorityFilter;
  counts: Record<TaskFilter, number>;
  onStatusChange: (status: TaskFilter) => void;
  onPriorityChange: (priority: PriorityFilter) => void;
}

const statusOptions: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
];

const priorityOptions: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'Усі пріоритети' },
  { value: 'high', label: 'Високий' },
  { value: 'medium', label: 'Середній' },
  { value: 'low', label: 'Низький' },
];

function TaskFilters({
  status,
  priority,
  counts,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <div className="task-filters__group" role="group" aria-label="Фільтр за станом">
        {statusOptions.map((option) => {
          const isActive = option.value === status;
          return (
            <button
              key={option.value}
              type="button"
              className={`task-filters__button${isActive ? ' task-filters__button--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
              <span className="task-filters__count">{counts[option.value]}</span>
            </button>
          );
        })}
      </div>

      <label className="task-filters__priority">
        <span className="task-filters__priority-label">Пріоритет</span>
        <select
          className="task-filters__select"
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as PriorityFilter)}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default TaskFilters;
