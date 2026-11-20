import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';


 // useState, значення якого зберігається в localStorage
 // Пошкоджені або невалідні дані ігноруються, застосунок не ламається
 
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      const parsed: unknown = JSON.parse(raw);
      if (isValid && !isValid(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Сховище недоступне (квота, приватний режим): працюємо лише в пам'яті
    }
  }, [key, value]);

  return [value, setValue];
}
