import type { TaskFilter } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
  current: TaskFilter;
  counts: Record<TaskFilter, number>;
  onChange: (filter: TaskFilter) => void;
}

const options: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
];

function TaskFilters({ current, counts, onChange }: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <div className="task-filters__group" role="group" aria-label="Фільтр завдань на сторінці">
        {options.map((option) => {
          const isActive = option.value === current;
          return (
            <button
              key={option.value}
              type="button"
              className={`task-filters__button${isActive ? ' task-filters__button--active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              <span className="task-filters__count">{counts[option.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TaskFilters;
