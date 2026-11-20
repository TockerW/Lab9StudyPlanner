import { useTaskDetails } from '../hooks/useTaskDetails';
import { priorityLabels } from '../utils/taskLabels';
import './TaskDetails.scss';

interface TaskDetailsProps {
  taskId: number;
  /** Змінюється після змін у списку, щоб деталі отримали актуальні дані. */
  revision: number;
  onClose: () => void;
}

function TaskDetails({ taskId, revision, onClose }: TaskDetailsProps) {
  const { state, retry } = useTaskDetails(taskId, revision);

  return (
    <section className="task-details" aria-label="Деталі завдання">
      <div className="task-details__header">
        <h2 className="task-details__title">Деталі завдання</h2>
        <button type="button" className="task-details__close" onClick={onClose}>
          Закрити
        </button>
      </div>

      {state.status === 'loading' && (
        <p className="task-details__state" role="status">
          Завантаження...
        </p>
      )}

      {state.status === 'error' && (
        <div className="task-details__state" role="alert">
          <p className="task-details__message">{state.message}</p>
          <button type="button" className="task-details__retry" onClick={retry}>
            Спробувати ще
          </button>
        </div>
      )}

      {state.status === 'success' && (
        <dl className="task-details__list">
          <dt className="task-details__label">Назва</dt>
          <dd className="task-details__value">{state.task.title}</dd>
          <dt className="task-details__label">Опис</dt>
          <dd className="task-details__value">{state.task.description || 'Опис не вказано'}</dd>
          <dt className="task-details__label">Категорія</dt>
          <dd className="task-details__value">{state.task.category}</dd>
          <dt className="task-details__label">Пріоритет</dt>
          <dd className="task-details__value">{priorityLabels[state.task.priority]}</dd>
          <dt className="task-details__label">Стан</dt>
          <dd className="task-details__value">
            {state.task.completed ? 'Виконано' : 'Не виконано'}
          </dd>
        </dl>
      )}
    </section>
  );
}

export default TaskDetails;
