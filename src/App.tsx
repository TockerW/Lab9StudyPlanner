import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import ToastHost from './components/ToastHost';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useTaskContext } from './hooks/useTaskContext';
import { getTaskCounts } from './utils/taskSelectors';
import './App.scss';

function App() {
  const { tasks } = useTaskContext();
  const { active } = getTaskCounts(tasks);

  // Effect: синхронізація заголовка вкладки з кількістю невиконаних завдань.
  useDocumentTitle(`Study Planner — ${active} active ${active === 1 ? 'task' : 'tasks'}`);

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__side">
          <TaskForm />
        </div>
        <div className="app__content">
          <TaskStats />
          <TaskFilters />
          <TaskList />
        </div>
      </main>
      <ToastHost />
    </div>
  );
}

export default App;
