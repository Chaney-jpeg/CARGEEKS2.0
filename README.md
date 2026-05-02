# CarGeeks 2.0 (React + Python API)

This system is recreated from scratch, using the preview only as a separate visual model.

## Architecture

- Frontend: React (Vite) in `frontend/`
- Backend: Python Flask API
- Database: SQLite with seed data
- Model reference only: `reference/cargeeks_system_preview.html`

## Project layout

- `app.py`: backend run entrypoint
- `server.py`: Flask API routes
- `cargeeks/config.py`: database paths
- `cargeeks/db.py`: database bootstrap
- `cargeeks/repositories.py`: SQL data access
- `cargeeks/services.py`: backend orchestration
- `schema.sql`: relational schema
- `seed.sql`: sample data
- `frontend/`: React application with 5 screens
- `reference/cargeeks_system_preview.html`: preview model (not used at runtime)

## API routes

- `GET /api/health`
- `GET /api/users`
- `GET /api/landing`
- `GET /api/posts`
- `GET /api/posts/<post_id>`
- `GET /api/profile/<user_id>`
- `GET /api/for-you?userId=<id>&interest=<interest>`
- `POST /api/posts`

## Run backend

```bash
pip install -r requirements.txt
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://127.0.0.1:5173` and proxies `/api` to the backend.

<img width="1340" height="602" alt="image" src="https://github.com/user-attachments/assets/34f84709-299e-42e7-8995-38b0e02c79fb" />

<img width="1275" height="603" alt="image" src="https://github.com/user-attachments/assets/409ce3ab-64c2-4f3e-bd0c-b2221d0af4d6" />

<img width="1221" height="310" alt="image" src="https://github.com/user-attachments/assets/4f3fc16e-5f37-4407-8105-d540b4b8a0ee" />



