import './TaskStats.scss';

interface TaskStatsProps {
  /** Загальна кількість на сервері (поле total у відповіді API). */
  total: number;
  pageCompleted: number;
  pageActive: number;
}

function TaskStats({ total, pageCompleted, pageActive }: TaskStatsProps) {
  return (
    <dl className="task-stats">
      <div className="task-stats__item">
        <dt className="task-stats__label">Всього</dt>
        <dd className="task-stats__value">{total}</dd>
      </div>
      <div className="task-stats__item task-stats__item--done">
        <dt className="task-stats__label">Виконано на сторінці</dt>
        <dd className="task-stats__value">{pageCompleted}</dd>
      </div>
      <div className="task-stats__item">
        <dt className="task-stats__label">Не виконано на сторінці</dt>
        <dd className="task-stats__value">{pageActive}</dd>
      </div>
    </dl>
  );
}

export default TaskStats;
