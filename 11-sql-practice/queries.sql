-- Example queries against the task manager schema.
-- Run these after schema.sql and seed.sql.

-- 1. SELECT: all tasks, newest-looking first by id.
SELECT id, title, priority, completed
FROM tasks
ORDER BY id;

-- 2. SELECT with WHERE: only high-priority, incomplete tasks.
SELECT title, due_date
FROM tasks
WHERE priority = 'high'
  AND completed = 0;

-- 3. JOIN: each task alongside the name of the user who owns it.
SELECT users.name AS owner, tasks.title, tasks.priority
FROM tasks
JOIN users ON users.id = tasks.user_id
ORDER BY users.name;

-- 4. Aggregation: how many tasks each user has, and how many are done.
SELECT
  users.name,
  COUNT(tasks.id)                       AS total_tasks,
  SUM(tasks.completed)                  AS completed_tasks
FROM users
LEFT JOIN tasks ON tasks.user_id = users.id
GROUP BY users.id, users.name
ORDER BY total_tasks DESC;

-- 5. LEFT JOIN to find users with NO tasks (none in this seed, but the
--    pattern is useful).
SELECT users.name
FROM users
LEFT JOIN tasks ON tasks.user_id = users.id
WHERE tasks.id IS NULL;

-- 6. UPDATE: mark a specific task as completed.
UPDATE tasks
SET completed = 1
WHERE id = 1;

-- 7. UPDATE: bump all low-priority tasks to medium.
UPDATE tasks
SET priority = 'medium'
WHERE priority = 'low';

-- 8. DELETE: remove completed tasks.
DELETE FROM tasks
WHERE completed = 1;

-- 9. Verify the state after the changes above.
SELECT id, title, priority, completed FROM tasks ORDER BY id;
