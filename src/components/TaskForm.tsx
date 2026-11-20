import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { NewTask, Priority, Task } from '../types/task';
import './TaskForm.scss';

const emptyForm: NewTask = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
};

interface TaskFormFieldsProps {
  task: Task | null;
}

function TaskFormFields({ task }: TaskFormFieldsProps) {
  const { addTask, updateTask, stopEditing } = useTaskContext();
  const isEditing = task !== null;

  const [form, setForm] = useState<NewTask>(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
        }
      : emptyForm,
  );
  const [error, setError] = useState('');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && error) setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    if (!title) {
      setError('Вкажіть назву завдання.');
      return;
    }

    const data: NewTask = {
      title,
      description: form.description.trim(),
      category: form.category.trim() || 'Загальне',
      priority: form.priority as Priority,
    };

    if (task) {
      updateTask(task.id, data);
      stopEditing();
    } else {
      addTask(data);
      setForm(emptyForm);
    }
    setError('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">
        {isEditing ? 'Редагування завдання' : 'Нове завдання'}
      </h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          Назва
        </label>
        <input
          id="task-title"
          name="title"
          className={`task-form__input${error ? ' task-form__input--invalid' : ''}`}
          value={form.title}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-title-error' : undefined}
          placeholder="Наприклад, Вивчити useReducer"
        />
        {error && (
          <p id="task-title-error" className="task-form__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-description">
          Опис
        </label>
        <textarea
          id="task-description"
          name="description"
          className="task-form__input task-form__input--textarea"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            name="category"
            className="task-form__input"
            value={form.category}
            onChange={handleChange}
            placeholder="React"
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            name="priority"
            className="task-form__input"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit">
          {isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {isEditing && (
          <button className="task-form__cancel" type="button" onClick={stopEditing}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}

function TaskForm() {
  const { editingTask } = useTaskContext();
  // key скидає внутрішній state форми при зміні завдання, що редагується.
  return <TaskFormFields key={editingTask?.id ?? 'new'} task={editingTask} />;
}

export default TaskForm;
