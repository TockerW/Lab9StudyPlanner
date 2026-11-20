import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error('useTaskContext має використовуватися всередині <TaskProvider>.');
  }
  return context;
}
