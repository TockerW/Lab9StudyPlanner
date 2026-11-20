import { useState } from 'react';
import type { Task } from '../types/task';
import { priorityLabels } from '../utils/taskLabels';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  /** Для завдання виконується запит — кнопки вимкнені. */
  isBusy: boolean;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: number) => void;
  onToggle: (task: Task) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({
  task,
  isBusy,
  isSelected,
  isEditing,
  onSelect,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const { id, title, description, category, priority, completed } = task;
  // Підтвердження видалення — локальний UI state елемента.
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const classNames = [
    'task-item',
    `task-item--${priority}`,
    completed && 'task-item--completed',
    isBusy && 'task-item--busy',
    isSelected && 'task-item--selected',
    isEditing && 'task-item--editing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className="task-item__body">
        <h3 className="task-item__title">{title}</h3>
        {description && <p className="task-item__description">{description}</p>}
        <div className="task-item__meta">
          <span className="task-item__tag">{category}</span>
          <span className={`task-item__priority task-item__priority--${priority}`}>
            {priorityLabels[priority]} пріоритет
          </span>
          <span className="task-item__status">{completed ? 'Виконано' : 'Не виконано'}</span>
          {isBusy && <span className="task-item__badge">Збереження...</span>}
        </div>
      </div>

      {isConfirmingDelete ? (
        <div className="task-item__confirm" role="group" aria-label="Підтвердження видалення">
          <span className="task-item__confirm-text">Видалити завдання?</span>
          <button
            type="button"
            className="task-item__button task-item__button--danger"
            disabled={isBusy}
            onClick={() => {
              setIsConfirmingDelete(false);
              onDelete(id);
            }}
          >
            Так, видалити
          </button>
          <button
            type="button"
            className="task-item__button"
            onClick={() => setIsConfirmingDelete(false)}
          >
            Ні
          </button>
        </div>
      ) : (
        <div className="task-item__actions">
          <button type="button" className="task-item__button" onClick={() => onSelect(id)}>
            Деталі
          </button>
          <button
            type="button"
            className="task-item__button"
            onClick={() => onToggle(task)}
            disabled={isBusy}
          >
            {completed ? 'Повернути' : 'Виконано'}
          </button>
          <button
            type="button"
            className="task-item__button"
            onClick={() => onEdit(id)}
            disabled={isBusy}
            aria-label={`Редагувати завдання «${title}»`}
          >
            Редагувати
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--danger"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isBusy}
            aria-label={`Видалити завдання «${title}»`}
          >
            Видалити
          </button>
        </div>
      )}
    </li>
  );
}

export default TaskItem;
