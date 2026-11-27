import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import type { PriorityFilter, TaskFilter } from '../types/task';
import { isPriorityFilter, isTaskFilter } from '../utils/taskSelectors';

 // Фільтри та сторінка живуть в URL: /tasks?status=completed&priority=high&page=2.
 // URL — єдине джерело правди, окремого state для них немає.

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = searchParams.get('status');
  const rawPriority = searchParams.get('priority');
  const rawPage = Number(searchParams.get('page'));

  const status: TaskFilter = isTaskFilter(rawStatus) ? rawStatus : 'all';
  const priority: PriorityFilter = isPriorityFilter(rawPriority) ? rawPriority : 'all';
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  // null видаляє параметр: значення за замовчуванням в URL не потрібні
  
  const update = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === null) next.delete(key);
          else next.set(key, value);
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const setStatus = useCallback(
    (value: TaskFilter) => update({ status: value === 'all' ? null : value }),
    [update],
  );
  const setPriority = useCallback(
    (value: PriorityFilter) => update({ priority: value === 'all' ? null : value }),
    [update],
  );
  const setPage = useCallback(
    (value: number) => update({ page: value <= 1 ? null : String(value) }),
    [update],
  );

  return { status, priority, page, setStatus, setPriority, setPage };
}
