import { useEffect } from 'react';

// Синхронізує заголовок вкладки браузера зі значенням
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
