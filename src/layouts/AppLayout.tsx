import { Outlet } from 'react-router';
import Header from '../components/Header';
import ToastHost from '../components/ToastHost';
import './AppLayout.scss';

// Спільний layout: Header + навігація + область контенту (Outlet) + Toast
function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <ToastHost />
    </div>
  );
}

export default AppLayout;
