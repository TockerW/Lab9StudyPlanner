# Study Planner (Лабораторна робота №8 — React Fundamentals)

Vite + React 19 + TypeScript, стилі: SCSS + BEM. Дані зберігаються лише в пам'яті (useState).

## Запуск

```bash
nvm use          # Node.js >= 22.22
npm install
npm run dev      # режим розробки
npm run lint     # ESLint
npm run build    # перевірка TypeScript + збірка
```

## Структура

```
src/
├── components/  Header, TaskForm, TaskStats, TaskFilters, TaskList, TaskItem
├── data/        initialTasks.ts
├── styles/      SCSS-файл на кожен компонент (BEM) + _variables.scss, base.scss
├── types/       task.ts (Task, Priority, TaskFilter, NewTask)
├── App.tsx      state: tasks, filter; усі обробники
└── main.tsx
```

State (`tasks`, `filter`) живе в `App`, дочірні компоненти отримують дані через props і
повідомляють про події через callback-функції (`onAddTask`, `onToggle`, `onDelete`, `onChange`).

## Реалізовано

Основне: список, додавання з валідацією назви (без `alert`), виконано/не виконано,
видалення, статистика (похідні значення без окремого state), фільтри (Всі / Виконані /
Не виконані), повідомлення для порожнього списку та порожнього фільтра.

Додатково: лічильники в кнопках фільтра, кнопка «Очистити виконані».

## Рекомендовані коміти (Conventional Commits)

```
git switch -c feature/react-fundamentals
chore(lab-08): init vite react typescript project
feat(lab-08): add task model and initial data
feat(lab-08): add task list and task item components
feat(lab-08): add task form with validation
feat(lab-08): add toggle and delete task actions
feat(lab-08): add task filters and stats
style(lab-08): style components with scss and bem
feat(lab-08): add clear completed button and filter counters
docs(lab-08): add readme and answers to control questions
```

## Відповіді на контрольні запитання

1. **Компонент** — функція, що повертає розмітку (JSX) і описує частину інтерфейсу. UI збирається з
   компонентів, бо їх можна повторно використовувати, тестувати окремо та складати в дерево.
2. **JSX** — синтаксичне розширення JavaScript, яке компілюється у виклики `jsx()`. Відмінності від HTML:
   `className` замість `class`, `htmlFor` замість `for`, camelCase-атрибути, обов'язкове закриття тегів,
   вирази у `{}`.
3. Функція повертає одне значення, тому розмітка має мати один корінь; без зайвого DOM-вузла
   використовують Fragment (`<>...</>`).
4. У фігурних дужках: `{title}`, `{count + 1}`, `{items.map(...)}`, також у атрибутах: `className={cls}`.
5. **Props** — вхідні дані компонента (read-only об'єкт). Батько передає їх як атрибути:
   `<TaskItem task={task} />`.
6. Ні, props змінювати не можна. Батько передає callback (`onToggle`), дочірній компонент викликає його,
   а батько оновлює свій state.
7. `useState` додає компоненту пам'ять між рендерами. Повертає масив `[value, setValue]`.
8. React порівнює посилання; мутація не змінює посилання, тому React може не перерендерити
   компонент, а також ламається передбачуваність даних. Потрібно створювати копію.
9. `setState(value)` задає значення напряму; `setState(prev => ...)` обчислює нове значення з
   актуального попереднього — безпечно при кількох оновленнях підряд та в асинхронному коді.
10. Через `array.map(item => <Item key={item.id} ... />)` — повертається масив елементів JSX.
11. `key` дозволяє React ідентифікувати елементи між рендерами. Індекс як key проблемний при
    додаванні, видаленні, сортуванні: key «переїжджає» до інших даних, збивається внутрішній state
    елементів та порядок оновлень.
12. Рендеринг різної розмітки залежно від умови: `if`/ранній `return`, тернарний оператор `? :`,
    оператор `&&`, змінна з JSX.
13. Local state належить компоненту й змінюється ним; props приходять ззовні й для дочірнього
    компонента незмінні.
14. У найближчому спільному батьківському компоненті (підйом стану, *lifting state up*) — тут це `App`.
15. React ставить оновлення в чергу, перераховує компонент з новим значенням (рендер) та оновлює DOM
    лише там, де є зміни. Змінна `state` у вже запущеному рендері не змінюється.
16. Це похідні дані: їх можна обчислити з `tasks` під час рендеру. Окремий state дублював би дані й міг
    би розсинхронізуватися.
17. Immutable update — створення нового масиву/об'єкта замість зміни старого: `[...arr, item]`,
    `arr.filter(...)`, `arr.map(...)`, `{ ...obj, field: value }`.
