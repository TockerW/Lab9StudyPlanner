import { useState } from 'react';
import { Link } from 'react-router';
import { useRequireAuth } from '../hooks/useRequireAuth';
import type { Task } from '../types/task';
import { priorityLabels } from '../utils/taskLabels';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  /** Для завдання виконується запит — кнопки вимкнені. */
  isBusy: boolean;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, isBusy, onToggle, onDelete }: TaskItemProps) {
  const { id, title, description, category, priority, completed } = task;
  // Підтвердження видалення — локальний UI state елемента.
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  // Гість не може змінювати дані: перевірка виконується перед кожною дією.
  const requireAuth = useRequireAuth();

  const classNames = [
    'task-item',
    `task-item--${priority}`,
    completed && 'task-item--completed',
    isBusy && 'task-item--busy',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classNames}>
      <div className="task-item__body">
        <h3 className="task-item__title">
          <Link className="task-item__link" to={`/tasks/${id}`}>
            {title}
          </Link>
        </h3>
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
          <Link className="task-item__button" to={`/tasks/${id}`}>
            Деталі
          </Link>
          <button
            type="button"
            className="task-item__button"
            onClick={() => requireAuth() && onToggle(task)}
            disabled={isBusy}
          >
            {completed ? 'Повернути' : 'Виконано'}
          </button>
          <button
            type="button"
            className="task-item__button task-item__button--danger"
            onClick={() => requireAuth() && setIsConfirmingDelete(true)}
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
