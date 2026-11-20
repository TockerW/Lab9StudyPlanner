import { useTaskContext } from '../hooks/useTaskContext';
import { getTaskCounts } from '../utils/taskSelectors';
import './TaskStats.scss';

function TaskStats() {
  const { tasks } = useTaskContext();
  const { total, completed, active } = getTaskCounts(tasks);

  return (
    <dl className="task-stats">
      <div className="task-stats__item">
        <dt className="task-stats__label">Всього</dt>
        <dd className="task-stats__value">{total}</dd>
      </div>
      <div className="task-stats__item task-stats__item--done">
        <dt className="task-stats__label">Виконано</dt>
        <dd className="task-stats__value">{completed}</dd>
      </div>
      <div className="task-stats__item">
        <dt className="task-stats__label">Не виконано</dt>
        <dd className="task-stats__value">{active}</dd>
      </div>
    </dl>
  );
}

export default TaskStats;
