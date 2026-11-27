import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '../api/errors';
import PageMessage from '../components/PageMessage';
import TaskFormDialog from '../components/TaskFormDialog';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useTaskDetails } from '../hooks/useTaskDetails';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useToast } from '../hooks/useToast';
import type { TaskFormData } from '../schemas/taskSchema';
import { priorityLabels } from '../utils/taskLabels';
import './TaskDetailsPage.scss';

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString('uk-UA') : 'Невідомо (завдання із сервера)';
}

function TaskDetailsContent({ taskId }: { taskId: number }) {
  const { state, reload } = useTaskDetails(taskId);
  const { update, remove } = useTaskMutations();
  const { showToast } = useToast();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    if (requireAuth()) setIsEditOpen(true);
  };

  const handleDeleteClick = () => {
    if (requireAuth()) setIsConfirmingDelete(true);
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    await update(taskId, data, 'Зміни збережено.');
    reload(); // оновлюємо дані на сторінці без перезавантаження
  };

  const handleDeleteConfirm = async () => {
    if (!requireAuth()) return;
    setIsDeleting(true);
    try {
      await remove(taskId);
      navigate('/tasks');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  if (state.status === 'loading') {
    return <PageMessage>Завантаження...</PageMessage>;
  }

  if (state.status === 'error') {
    return (
      <PageMessage variant="error">
        <p className="task-details-page__message">{state.message}</p>
        <button type="button" className="task-details-page__retry" onClick={reload}>
          Спробувати ще
        </button>
      </PageMessage>
    );
  }

  const { task } = state;

  return (
    <article className="task-details-page__card">
      <h2 className="task-details-page__title">{task.title}</h2>

      <dl className="task-details-page__list">
        <dt className="task-details-page__label">Опис</dt>
        <dd className="task-details-page__value">{task.description || 'Опис не вказано'}</dd>
        <dt className="task-details-page__label">Категорія</dt>
        <dd className="task-details-page__value">{task.category}</dd>
        <dt className="task-details-page__label">Пріоритет</dt>
        <dd className="task-details-page__value">{priorityLabels[task.priority]}</dd>
        <dt className="task-details-page__label">Стан</dt>
        <dd className="task-details-page__value">
          {task.completed ? 'Виконано' : 'Не виконано'}
        </dd>
        <dt className="task-details-page__label">Створив</dt>
        <dd className="task-details-page__value">{task.createdBy}</dd>
        <dt className="task-details-page__label">Дата створення</dt>
        <dd className="task-details-page__value">{formatDate(task.createdAt)}</dd>
      </dl>

      {isConfirmingDelete ? (
        <div className="task-details-page__actions" role="group" aria-label="Підтвердження видалення">
          <span className="task-details-page__confirm">Видалити це завдання?</span>
          <button
            type="button"
            className="task-details-page__button task-details-page__button--danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Видалення...' : 'Так, видалити'}
          </button>
          <button
            type="button"
            className="task-details-page__button"
            onClick={() => setIsConfirmingDelete(false)}
            disabled={isDeleting}
          >
            Ні
          </button>
        </div>
      ) : (
        <div className="task-details-page__actions">
          <button type="button" className="task-details-page__button" onClick={handleEditClick}>
            Редагувати
          </button>
          <button
            type="button"
            className="task-details-page__button task-details-page__button--danger"
            onClick={handleDeleteClick}
          >
            Видалити
          </button>
        </div>
      )}

      <TaskFormDialog
        open={isEditOpen}
        mode="edit"
        task={task}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </article>
  );
}

function TaskDetailsPage() {
  // Route param: /tasks/:taskId
  const { taskId } = useParams();
  const id = Number(taskId);
  const isValidId = Number.isInteger(id) && id >= 1;

  return (
    <section className="task-details-page">
      <Link className="task-details-page__back" to="/tasks">
        ← До списку
      </Link>
      {isValidId ? (
        <TaskDetailsContent taskId={id} />
      ) : (
        <PageMessage variant="error">Некоректний ідентифікатор завдання.</PageMessage>
      )}
    </section>
  );
}

export default TaskDetailsPage;
