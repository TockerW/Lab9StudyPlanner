import { Link } from 'react-router';
import PageMessage from '../components/PageMessage';

function NotFoundPage() {
  return (
    <PageMessage variant="error">
      <h2>Сторінку не знайдено (404)</h2>
      <p>
        <Link to="/tasks">Повернутися до завдань</Link>
      </p>
    </PageMessage>
  );
}

export default NotFoundPage;
