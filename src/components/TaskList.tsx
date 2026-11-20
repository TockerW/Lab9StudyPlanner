import { useTaskContext } from '../hooks/useTaskContext';
import { filterTasks } from '../utils/taskSelectors';
import TaskItem from './TaskItem';
import './TaskList.scss';

function TaskList() {
  const { tasks, filter } = useTaskContext();
  // Derived state: обчислюється під час render.
  const visibleTasks = filterTasks(tasks, filter);

  if (visibleTasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        {tasks.length > 0 ? (
          <p className="task-list__message">За цим фільтром завдань немає.</p>
        ) : (
          <>
            <p className="task-list__message">Завдань поки немає.</p>
            <p className="task-list__hint">Додайте перше навчальне завдання.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;
