import { useEffect, useId, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '../api/errors';
import { taskSchema } from '../schemas/taskSchema';
import type { TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';
import './TaskFormDialog.scss';

export interface TaskFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  // Якщо кидає помилку — діалог лишається відкритим і показує її
  onSubmit: (data: TaskFormData) => Promise<void>;
}

const emptyValues: TaskFormData = {
  title: '',
  description: '',
  category: 'General',
  priority: 'medium',
};

interface FormProps extends Omit<TaskFormDialogProps, 'open'> {
  titleId: string;
}

function TaskFormDialogForm({ mode, task, onClose, onSubmit, titleId }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues:
      mode === 'edit' && task
        ? {
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
          }
        : emptyValues,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  });

  return (
    <form className="task-form-dialog__form" onSubmit={submit} noValidate>
      <h2 className="task-form-dialog__title" id={titleId}>
        {mode === 'create' ? 'Нове завдання' : 'Редагування завдання'}
      </h2>

      <div className="task-form-dialog__field">
        <label className="task-form-dialog__label" htmlFor="task-title">
          Назва
        </label>
        <input
          id="task-title"
          className="task-form-dialog__control"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          autoFocus
          {...register('title')}
        />
        {errors.title && (
          <p id="task-title-error" className="task-form-dialog__error" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="task-form-dialog__field">
        <label className="task-form-dialog__label" htmlFor="task-description">
          Опис
        </label>
        <textarea
          id="task-description"
          className="task-form-dialog__control task-form-dialog__control--textarea"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'task-description-error' : undefined}
          {...register('description')}
        />
        {errors.description && (
          <p id="task-description-error" className="task-form-dialog__error" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="task-form-dialog__row">
        <div className="task-form-dialog__field">
          <label className="task-form-dialog__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            className="task-form-dialog__control"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'task-category-error' : undefined}
            {...register('category')}
          />
          {errors.category && (
            <p id="task-category-error" className="task-form-dialog__error" role="alert">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="task-form-dialog__field">
          <label className="task-form-dialog__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            className="task-form-dialog__control"
            {...register('priority')}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      {submitError && (
        <p className="task-form-dialog__error task-form-dialog__error--form" role="alert">
          {submitError}
        </p>
      )}

      <div className="task-form-dialog__actions">
        <button
          type="submit"
          className="task-form-dialog__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Збереження...' : mode === 'create' ? 'Створити' : 'Зберегти'}
        </button>
        <button type="button" className="task-form-dialog__cancel" onClick={onClose}>
          Скасувати
        </button>
      </div>
    </form>
  );
}

 // Один діалог для створення та редагування. Використовує нативний <dialog>:
 // showModal() дає фокус усередині діалогу, закриття через Escape та затемнення фону
 
function TaskFormDialog({ open, mode, task, onClose, onSubmit }: TaskFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Effect: синхронізує prop open з DOM-станом <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="task-form-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Клік по затемненню (сам <dialog>) закриває вікно
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <TaskFormDialogForm
          key={`${mode}-${task?.id ?? 'new'}`}
          mode={mode}
          task={task}
          onClose={onClose}
          onSubmit={onSubmit}
          titleId={titleId}
        />
      )}
    </dialog>
  );
}

export default TaskFormDialog;
