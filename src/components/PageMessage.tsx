import type { ReactNode } from 'react';
import './PageMessage.scss';

interface PageMessageProps {
  children: ReactNode;
  variant?: 'info' | 'error';
}

function PageMessage({ children, variant = 'info' }: PageMessageProps) {
  return (
    <div
      className={`page-message page-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

export default PageMessage;
