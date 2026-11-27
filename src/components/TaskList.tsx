import type { LoadStatus } from '../reducers/taskListReducer';
import type { Task } from '../types/task';
import TaskItem from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  status: LoadStatus;
  errorMessage: string | null;
  /** Завдання після застосування фільтрів. */
  tasks: Task[];
  /** Чи є на поточній сторінці завдання до фільтрації. */
  hasAnyTasks: boolean;
  busyIds: number[];
  onRetry: () => void;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

function TaskList({
  status,
  errorMessage,
  tasks,
  hasAnyTasks,
  busyIds,
  onRetry,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (status === 'loading') {
    return (
      <div className="task-list task-list--state" role="status">
        <p className="task-list__message">Завантаження...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="task-list task-list--state task-list--error" role="alert">
        <p className="task-list__message">Помилка завантаження.</p>
        {errorMessage && <p className="task-list__hint">{errorMessage}</p>}
        <button type="button" className="task-list__retry" onClick={onRetry}>
          Спробувати ще
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--state">
        {hasAnyTasks ? (
          <p className="task-list__message">За цими фільтрами завдань немає.</p>
        ) : (
          <>
            <p className="task-list__message">Завдань не знайдено.</p>
            <p className="task-list__hint">Додайте перше навчальне завдання.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isBusy={busyIds.includes(task.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
