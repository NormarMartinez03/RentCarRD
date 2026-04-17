# RentCarRD

Aplicación fullstack para **rent car en República Dominicana** con backend + frontend desarrollados en paralelo.

## Funcionalidades incluidas en esta fase

- Login y registro (JWT).
- Control de acceso por roles (RBAC) desde backend.
- Vehículos por categoría y sucursal.
- Endpoint para reservas activas (panel admin/operaciones).
- Frontend React con:
  - Pantalla de login/registro.
  - Dashboard base con listado de vehículos.
  - Vista de reservas activas para roles operativos.

## Estructura del proyecto

- `database/`
  - `schema.sql`: esquema PostgreSQL.
  - `seed.sql`: roles, permisos y datos iniciales.
- `backend/`
  - API en Node.js + Express + PostgreSQL.
- `frontend/`
  - SPA en React + Vite.
- `docs/`
  - Diseño de módulos y endpoints sugeridos.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## 1) Base de datos

Crear la base de datos y ejecutar:

```bash
psql -U postgres -d rentcar_rd -f database/schema.sql
psql -U postgres -d rentcar_rd -f database/seed.sql
```

## 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API disponible en `http://localhost:4000`.

### Endpoints implementados

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requiere token)
- `GET /api/vehicles`
- `POST /api/vehicles` (ADMIN/MANAGER + permiso `vehicle.create`)
- `GET /api/vehicles/active-reservations` (roles operativos + permiso `reservation.active.read`)

## 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`.

Si deseas apuntar a otro backend, usa variable:

```bash
VITE_API_URL=http://localhost:4000/api
```

## Roles sugeridos

- **ADMIN**: administración total (carros, reservas activas, usuarios, reportes).
- **MANAGER**: operación de flota y reservas.
- **AGENT**: gestión de reservas y clientes.
- **CUSTOMER**: reservas propias.
