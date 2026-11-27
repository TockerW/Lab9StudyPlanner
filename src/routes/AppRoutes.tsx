import { Navigate, Route, Routes } from 'react-router';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/ProfilePage';
import TaskDetailsPage from '../pages/TaskDetailsPage';
import TasksPage from '../pages/TasksPage';
import ProtectedRoute from './ProtectedRoute';

// Declarative Mode: Routes + Route, layout як батьківський route
function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="tasks/:taskId" element={<TaskDetailsPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
