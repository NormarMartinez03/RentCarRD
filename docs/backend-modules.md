# Diseño de módulos backend (RentCarRD)

## 1) Auth + RBAC

- Login con JWT (access + refresh token).
- Middleware `requireRole` y `requirePermission`.
- Tabla pivote `role_permissions` para control granular.

## 2) Módulo de vehículos

### Funciones
- Registrar nuevo carro.
- Actualizar información del carro.
- Cambiar estado (`available`, `reserved`, `maintenance`, `out_of_service`).
- Listar por categoría, sucursal y estado.

### Endpoints sugeridos
- `POST /api/vehicles`
- `GET /api/vehicles`
- `GET /api/vehicles/:id`
- `PATCH /api/vehicles/:id`
- `PATCH /api/vehicles/:id/status`

## 3) Módulo de categorías

- `POST /api/categories`
- `GET /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

## 4) Módulo de reservas

### Funciones
- Crear reserva (cliente o agente).
- Verificar disponibilidad por rango de fechas.
- Confirmar/cancelar/finalizar reserva.
- Obtener reservas activas para panel admin.

### Endpoints sugeridos
- `POST /api/reservations`
- `GET /api/reservations`
- `GET /api/reservations/active`
- `PATCH /api/reservations/:id/confirm`
- `PATCH /api/reservations/:id/cancel`
- `PATCH /api/reservations/:id/complete`

## 5) Módulo de clientes

- `POST /api/customers`
- `GET /api/customers`
- `GET /api/customers/:id`
- `GET /api/customers/:id/reservations`

## 6) Módulo de pagos

- `POST /api/payments`
- `GET /api/payments?reservationId=...`
- `PATCH /api/payments/:id/refund`

## 7) Módulo de mantenimiento

- `POST /api/maintenance`
- `GET /api/maintenance?vehicleId=...`

## 8) Módulo admin dashboard

### Widgets claves
- Reservas activas hoy.
- Vehículos disponibles vs reservados.
- Ingresos por período.
- Vehículos próximos a mantenimiento.

### Endpoints sugeridos
- `GET /api/admin/dashboard/kpis`
- `GET /api/admin/dashboard/active-reservations`
- `GET /api/admin/dashboard/revenue-summary`

## 9) Reglas de negocio críticas

1. Un vehículo no puede tener dos reservas superpuestas con estado `confirmed` o `active`.
2. Al confirmar reserva, el vehículo pasa a `reserved`.
3. Al iniciar el alquiler, reserva pasa a `active`.
4. Al completar el alquiler, reserva pasa a `completed` y vehículo a `available`.
5. Al cancelar reserva confirmada, vehículo regresa a `available`.

## 10) Matriz de acceso (resumen)

- **ADMIN**: acceso completo.
- **MANAGER**: lectura amplia + operación + reportes.
- **AGENT**: reservas, clientes, pagos básicos.
- **CUSTOMER**: solo sus reservas.
