-- Sample data for the task manager.

INSERT INTO users (id, name, email) VALUES
  (1, 'Maya Patel',   'maya@example.com'),
  (2, 'Liam Carter',  'liam@example.com'),
  (3, 'Sofia Rossi',  'sofia@example.com');

INSERT INTO tasks (user_id, title, description, priority, completed, due_date) VALUES
  (1, 'Finish portfolio',   'Polish the README files',        'high',   0, '2026-07-01'),
  (1, 'Buy groceries',      'Milk, eggs, bread',              'low',    1, '2026-06-18'),
  (1, 'Plan trip',          'Book flights and hotel',         'medium', 0, '2026-08-10'),
  (2, 'Review pull request','Check the new API endpoints',    'high',   0, '2026-06-20'),
  (2, 'Renew passport',     NULL,                             'medium', 0, '2026-09-01'),
  (3, 'Write blog post',    'Topic: learning SQL',            'medium', 1, '2026-06-15'),
  (3, 'Gym session',        'Leg day',                        'low',    0, NULL);
