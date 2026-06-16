# 10 · Express REST API

A small REST API for managing **tasks**, built with Node.js and Express. Data is
held in an in-memory array (no database needed to run it).

## Endpoints

| Method | Path         | Description           |
|--------|--------------|-----------------------|
| GET    | `/`          | API info / health     |
| GET    | `/tasks`     | List all tasks        |
| GET    | `/tasks/:id` | Get one task          |
| POST   | `/tasks`     | Create a task         |
| PUT    | `/tasks/:id` | Update a task         |
| DELETE | `/tasks/:id` | Delete a task         |

### Task shape

```json
{ "id": 1, "title": "Learn Express", "completed": false }
```

## Validation & errors

- `title` is required and must be a non-empty string.
- `completed`, if provided, must be a boolean.
- Invalid bodies return **400** with an `errors` array.
- Missing tasks return **404**.
- Unexpected errors return **500** via a central error handler.

## Run it

```bash
npm install
npm run dev    # auto-restarts on file changes (node --watch)
# or
npm start      # plain start
```

Server runs at `http://localhost:3000`.

## Try it

```bash
# List tasks
curl http://localhost:3000/tasks

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Read the docs"}'

# Update a task
curl -X PUT http://localhost:3000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"title":"Build a REST API","completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/3
```

## Concepts practiced

- Express routing with `Router`
- Middleware (JSON parsing, logging, 404, error handler)
- Request validation and proper HTTP status codes
- REST conventions (201 on create, 204 on delete)

## Note

Storage is in-memory, so data resets each time the server restarts. Swapping in
a JSON file or database is a natural next step.
