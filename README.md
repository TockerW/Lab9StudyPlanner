# Study Planner (ЛР №8–10)

Vite + React 19 + TypeScript, стилі: SCSS + BEM (кожен компонент має `.scss` поруч).
Попередні лабораторні: `docs/lab-08.md`, `docs/lab-09.md`.

## Запуск

```bash
nvm use                     # Node.js >= 22.22
cp .env.example .env        # файл .env не комітиться
npm install
npm run dev
npm run lint
npm run build
```

`.env.example`: `VITE_API_URL=https://dummyjson.com`

## ЛР №10: REST API

```
src/
├── api/            httpClient.ts (fetch, URL з VITE_API_URL, перевірка response.ok), errors.ts
├── repositories/   taskRepository.ts (getAll, getById, create, update, delete + mapping DTO → Task)
│                   sessionOverlay.ts (імітація збереження змін на час сесії)
├── hooks/          useTasks (server state + CRUD), useTaskDetails, useToast,
│                   useLocalStorage, useDocumentTitle
├── reducers/       taskListReducer.ts (loading / success / error + зміни списку)
├── context/        ToastContext, ToastProvider
├── pages/          TasksPage (client/UI state: сторінка, фільтр, вибране, редаговане)
├── components/     Header, TaskForm, TaskStats, TaskFilters, TaskList, TaskItem,
│                   TaskDetails, Pagination, Toast, ToastHost
└── types/          task.ts (domain), api.ts (DTO), toast.ts
```

**Шари:** компонент → `useTasks` → `taskRepository` → `httpClient` → `fetch`.
Компоненти не містять URL і HTTP-викликів (`grep "fetch(\|/todos" src` знаходить лише `api/` та `repositories/`).

| Вимога | Де |
|---|---|
| GET список + пагінація (limit/skip) | `taskRepository.getAll`, `Pagination`, `useTasks(page)` |
| GET за id (деталі) | `taskRepository.getById`, `TaskDetails`, `useTaskDetails` |
| POST / PUT / DELETE | `create`, `update`, `delete` у repository |
| loading / success / error / empty | `taskListReducer`, `TaskList` |
| Повтор після помилки | кнопка «Спробувати ще» (`reload`, `retry`) |
| Скасування GET | `AbortController` у `useEffect` (`useTasks`, `useTaskDetails`), `isAbortError` не показується як помилка |
| Підтвердження видалення | inline «Видалити завдання? Так / Ні» у `TaskItem` |
| Server state vs client state | server: `useTasks`; client: `TasksPage` (`page`, `filter`, `selectedId`, `editingId`) |
| localStorage | лише client state (активний фільтр), завдання в ньому не зберігаються |

### Обмеження DummyJSON

DummyJSON імітує POST/PUT/DELETE і нічого не зберігає: створений todo повертає id 255 щоразу,
а запит `/todos/255` дає 404. Тому `sessionOverlay` запам’ятовує успішні зміни в пам’яті:
створені завдання показуються на початку першої сторінки, зміни та видалення зберігаються
до перезавантаження сторінки. Поля `description`, `priority`, `category` API не підтримує,
тому це client-only metadata (за замовчуванням `''`, `medium`, `General`).
Для реального API файл `sessionOverlay.ts` не потрібен.

Що прибрано порівняно з ЛР №9: Undoable Delete, «Очистити виконані», «Скинути дані»,
TaskContext/TaskProvider та reducer для локального списку (замість них server state).
Збережено: Toast, `useLocalStorage`, `useDocumentTitle`, reducer (тепер для стану завантаження).

## Коміти (приклад)

```
git switch -c feature/rest-api
chore(lab-10): add env config and env example
feat(lab-10): add http client and error normalization
feat(lab-10): add task repository with dto mapping
refactor(lab-10): replace local tasks state with useTasks hook
feat(lab-10): add pagination and request cancellation
feat(lab-10): add loading error and empty states with retry
feat(lab-10): add task details loaded by id
feat(lab-10): create update and delete tasks via repository
feat(lab-10): add delete confirmation
style(lab-10): add styles for pagination and details
docs(lab-10): update readme
```

## Відповіді на контрольні запитання (ЛР №10)

1. **REST API** — спосіб взаємодії клієнта із сервером через HTTP: ресурси мають URL
   (`/todos/5`), дії задаються методами HTTP, сервер повертає дані (зазвичай JSON) і код статусу.
2. **GET** читає дані (без змін на сервері). **POST** створює ресурс. **PUT** замінює ресурс повністю,
   **PATCH** змінює його частково. **DELETE** видаляє ресурс.
3. Щоб UI не залежав від деталей HTTP (URL, формат відповіді, помилки): код легше читати,
   тестувати й змінювати, а логіка не дублюється в компонентах (separation of concerns).
4. **Repository Pattern** — шар, який надає застосунку просту колекцієподібну API для даних
   (`getAll`, `getById`, `create`, `update`, `delete`) і ховає, звідки вони беруться.
5. Ховає endpoint-и та DTO-формат DummyJSON, перетворює `ApiTodo` на `Task` і навпаки, надає
   методи для роботи із завданнями. Компоненти про HTTP нічого не знають.
6. API client — низькорівнева робота з HTTP: побудова URL, заголовки, `fetch`, перевірка
   `response.ok`, помилки. Repository — рівень вище: знає, які ресурси та поля є в домені Task, і
   користується клієнтом.
7. Loading (запит триває), success (дані отримано), error (помилка, можна повторити),
   empty (запит успішний, але даних немає). Також скасований запит і стан mutation (busy).
8. Server state — дані, що живуть на сервері й лише копіюються на клієнт (можуть застаріти,
   вимагають завантаження та синхронізації). Client/UI state належить застосунку: сторінка,
   фільтр, відкрита форма, вибраний елемент.
9. Копія в localStorage стає другим джерелом правди: дані можуть розійтися з сервером, застаріти,
   і доведеться вирішувати конфлікти. Зберігати локально варто лише client/UI state.
10. `AbortController` скасовує запит, який більше не потрібен: перехід на іншу сторінку,
    unmount, повторний запит. Це економить трафік і не дає застарілій відповіді перезаписати
    свіжу (race condition).
11. Без cleanup запит завершиться, і код спробує оновити state неіснуючого компонента (або
    перезапише актуальні дані). Тому в cleanup `useEffect` викликають `controller.abort()`, а
    `AbortError` ігнорують.
12. `fetch` — вбудований у браузер, мінімалістичний: помилки HTTP (404, 500) не кидають
    виняток, JSON треба розбирати вручну (`response.json()`), статус перевіряють через `response.ok`.
    Axios — бібліотека: автоматично парсить JSON, кидає помилку для не-2xx, має interceptors,
    baseURL та timeout, але це додаткова залежність.
13. **Optimistic update** — інтерфейс змінюється одразу, до відповіді сервера; у разі помилки
    зміну відкочують. Це робить інтерфейс швидшим (наприклад, перемикання completed).
14. Сервер уже повернув створений ресурс, тож достатньо оновити state (додати елемент у список).
    Це швидше, не втрачає стан сторінки, форм і прокрутки та не навантажує сервер зайвим запитом.
15. Перевірити `response.ok` (або статус), кинути типізовану помилку (`HttpError` зі `status`),
    перетворити її на зрозуміле повідомлення для користувача, показати його в UI (error-стан чи
    Toast) із можливістю повтору, не плутати з скасуванням запиту та не використовувати `alert`.
