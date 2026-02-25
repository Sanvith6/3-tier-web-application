# 3-Tier CRUD Web Application

Tech stack:
- Frontend: React (Vite) + JavaScript
- Backend: Node.js + Express.js
- Database: MySQL

Entity used for CRUD: `products`

## Project Structure

- `frontend/` - presentation tier (React UI)
- `backend/` - application/business/data-access tiers (Express API with layered architecture)
- `db/schema.sql` - database schema + sample data

## 1) Setup MySQL

1. Start MySQL server.
2. Run the SQL file:

```sql
SOURCE c:/project/project-devops/db/schema.sql;
```

## 2) Backend Setup

```powershell
cd c:\project\project-devops\backend
Copy-Item .env.example .env
```

Update `backend/.env` with your MySQL credentials.

Run backend:

```powershell
npm install
npm run dev
```

Backend default URL: `http://localhost:5000`

Health check: `GET http://localhost:5000/api/health`

## 3) Frontend Setup

```powershell
cd c:\project\project-devops\frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Endpoints

- `GET /api/products` - list all products
- `GET /api/products/:id` - get one product
- `POST /api/products` - create product
- `PUT /api/products/:id` - update product
- `DELETE /api/products/:id` - delete product

### Sample JSON for create/update

```json
{
  "name": "USB-C Hub",
  "price": 45.99,
  "category": "Accessories",
  "stock": 18
}
```

## Docker Setup (Frontend + Backend + MySQL)

This project includes:
- [docker-compose.yml](c:/project/project-devops/docker-compose.yml)
- [backend/Dockerfile](c:/project/project-devops/backend/Dockerfile)
- [frontend/Dockerfile](c:/project/project-devops/frontend/Dockerfile)

### 1) Start all services

```powershell
cd c:\project\project-devops
docker compose up --build -d
```

### 2) Open app and APIs

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`
- Products API: `http://localhost:5000/api/products`

### 3) Stop services

```powershell
docker compose down
```

### 4) Reset DB volume (optional, deletes data)

```powershell
docker compose down -v
```

Notes:
- `db/schema.sql` runs automatically on first MySQL startup.
- Default MySQL root password in compose is `rootpassword`. Change it in [docker-compose.yml](c:/project/project-devops/docker-compose.yml) for real use.
