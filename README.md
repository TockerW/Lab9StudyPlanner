# Study Planner (ЛР №8–9)

Vite + React 19 + TypeScript, стилі: SCSS + BEM (кожен компонент має `.scss` поруч).
Опис ЛР №8 та відповіді на її запитання: `docs/lab-08.md`.

## Запуск

```bash
nvm use          # Node.js >= 22.22
npm install
npm run dev
npm run lint
npm run build
```

## ЛР №9: State та Effects

```
src/
├── components/   Header, TaskForm (+ режим редагування), TaskStats, TaskFilters,
│                 TaskList, TaskItem, Toast, ToastHost (кожен з власним .scss)
├── context/      TaskContext.ts (createContext), TaskProvider.tsx
├── hooks/        useTaskContext, useLocalStorage<T>, useDocumentTitle
├── reducers/     taskReducer.ts (чиста функція)
├── utils/        taskStorage.ts (localStorage), taskSelectors.ts (derived data)
├── types/ data/ constants.ts
```

| Вимога | Де |
|---|---|
| useReducer | `TaskProvider.tsx` + `reducers/taskReducer.ts` (add, toggle, update, requestDelete, confirmDelete, undoDelete, clearCompleted, reset) |
| Context API | `TaskContext.ts`, `TaskProvider.tsx`; компоненти без props про state |
| Custom hooks | `useTaskContext` (помилка поза провайдером), `useLocalStorage` (фільтр), `useDocumentTitle` |
| localStorage | початковий state з `loadTasks()` (try/catch + валідація), запис через `useEffect` |
| document.title | `useDocumentTitle` в `App.tsx` |
| Toast | `Toast.tsx`, `ToastHost.tsx`: create / edit / delete / помилки |
| Undoable Delete | 5 с таймер у `useEffect` провайдера з `clearTimeout` у cleanup, прогрес у Toast, «Скасувати» |
| Редагування | `TaskForm` у режимі edit, зміни через `dispatch({ type: 'update' })` |
| Додатково | очищення виконаних з undo, скидання даних, мемоізоване значення Context |

Потік Undoable Delete: `requestDelete` → у state з'являється `pendingDeletion` → `useEffect`
запускає таймер → Undo (`undoDelete`) або завершення таймера (`confirmDelete`).
Reducer не містить таймерів, DOM та localStorage.

## Коміти (приклад)

```
git switch -c feature/state-effects
refactor(lab-09): move tasks state to reducer
feat(lab-09): add task context and useTaskContext hook
feat(lab-09): persist tasks in localStorage
feat(lab-09): add useLocalStorage hook for active filter
feat(lab-09): sync document title with active tasks
feat(lab-09): add task editing mode
feat(lab-09): add toast component
feat(lab-09): add undoable delete with timer progress
feat(lab-09): add clear completed and reset actions
style(lab-09): move component styles next to components
docs(lab-09): update readme
```

## Відповіді на контрольні запитання (ЛР №9)

1. Коли кілька компонентів потребують однакових даних: state переносять у найближчий спільний
   батьківський компонент, а вниз передають props.
2. Prop drilling — передача props через багато проміжних компонентів, яким вони самим не
   потрібні. Context дозволяє читати значення в будь-якому нащадку напряму.
3. Reducer — функція `(state, action) => newState`, що зосереджує всю логіку змін state в одному
   місці. Вона відрізняється від довільного `setState` тим, що зміни описуються іменованими діями
   й завжди повертають новий state.
4. Чиста: однакові аргументи дають однаковий результат, немає побічних ефектів (таймери,
   fetch, DOM, localStorage, `Date.now()`, `Math.random()`), вхідний state не мутується.
5. Action — об'єкт, що описує подію (`{ type: 'toggle', payload: { id } }`). `dispatch` — функція,
   яка відправляє action в reducer.
6. Коли state складний або кілька полів змінюються разом, коли багато різних операцій над одним
   state, коли логіку треба зібрати в одному місці й тестувати окремо.
7. Context API: `createContext` (створення), Provider (надає значення), споживач `useContext`
   (читає значення). Зазвичай додають власний hook, як `useTaskContext`.
8. Ні, лише те, що справді спільне для багатьох компонентів. Локальний state форми чи UI-деталі
   краще залишати в компонентах, бо кожна зміна значення Context перерендерює всіх споживачів.
9. Side effect — дія, що виходить за межі обчислення JSX: таймери, запити, localStorage, зміна
   `document.title`, підписки на події.
10. `useEffect` синхронізує компонент із зовнішньою системою після рендеру.
11. Effect запускається після першого рендеру та після кожного рендеру, у якому змінилась
    залежність. Cleanup виконується перед наступним запуском Effect і при unmount.
12. Це запис у зовнішню систему (сховище браузера), а не обчислення UI з props і state.
13. Reducer має бути чистим: таймер є побічним ефектом, його не можна безпечно повторити чи
    скасувати, а в Strict Mode reducer викликається двічі. Тому таймер запускає `useEffect`.
14. `clearTimeout` скасовує таймер, коли він більше не потрібен (Undo, нове видалення, unmount).
    Інакше він спрацює пізніше, коли дані вже змінилися, і викличе помилку або зайве видалення.
15. Дубльоване значення потрібно синхронізувати вручну, можна забути оновити, і дані
    розійдуться. Похідні значення обчислюють під час render із єдиного джерела істини.
16. Custom Hook — функція з префіксом `use`, що використовує інші hooks і інкапсулює логіку, яку
    можна повторно використовувати.
17. Назва починається з `use`; hooks викликаються лише на верхньому рівні функціонального
    компонента чи іншого hook (не в умовах, циклах, вкладених функціях); кожен виклик hook має
    власний ізольований state; hook повертає лише те, що потрібно споживачеві.
