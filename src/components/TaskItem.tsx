import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const priorityLabels: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

function TaskItem({ task }: TaskItemProps) {
  const { editingTask, pendingDeleteIds, toggleTask, requestDelete, startEditing } =
    useTaskContext();
  const { id, title, description, category, priority, completed } = task;

  const isPendingDelete = pendingDeleteIds.includes(id);
  const isEditing = editingTask?.id === id;

  const classNames = [
    'task-item',
    `task-item--${priority}`,
    completed && 'task-item--completed',
    isPendingDelete && 'task-item--pending',
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
          <span className="task-item__status">
            {completed ? 'Виконано' : 'Не виконано'}
          </span>
          {isPendingDelete && <span className="task-item__badge">Буде видалено</span>}
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button"
          onClick={() => toggleTask(id)}
          disabled={isPendingDelete}
        >
          {completed ? 'Повернути' : 'Виконано'}
        </button>
        <button
          type="button"
          className="task-item__button"
          onClick={() => startEditing(id)}
          disabled={isPendingDelete}
          aria-label={`Редагувати завдання «${title}»`}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--danger"
          onClick={() => requestDelete(id)}
          disabled={isPendingDelete}
          aria-label={`Видалити завдання «${title}»`}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
