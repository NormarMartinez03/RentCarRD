# RentCarRD

Plataforma web para gestión de **rent car en República Dominicana**, con:

- Vehículos organizados por categorías.
- Reservas online.
- Control de acceso por roles (RBAC).
- Panel administrativo con múltiples funciones (agregar carro, ver reservas activas, reportes, etc.).

## Módulos principales

1. **Autenticación y autorización**
   - Login seguro.
   - Roles y permisos granulares.
2. **Gestión de vehículos**
   - Crear/editar carros.
   - Estado: disponible, reservado, mantenimiento, fuera de servicio.
3. **Categorías de vehículos**
   - Económico, SUV, Lujo, Minivan, Pickup, etc.
4. **Reservas**
   - Crear, confirmar, cancelar, finalizar.
   - Consulta de reservas activas.
5. **Clientes**
   - Historial de reservas y documentos.
6. **Pagos y facturación**
   - Registro de pagos por reserva.
7. **Mantenimiento**
   - Historial de mantenimiento por vehículo.
8. **Sucursales**
   - Control por ubicación.
9. **Bitácora/Auditoría**
   - Registro de acciones críticas del sistema.

## Roles sugeridos

- **ADMIN**
  - Gestión total del sistema.
  - Crear carros, categorías, usuarios.
  - Ver reservas activas y reportes.
- **MANAGER**
  - Operación diaria, aprobación de reservas, monitoreo de flota.
- **AGENT**
  - Gestión de clientes y reservas en mostrador/call center.
- **CUSTOMER**
  - Crear y consultar sus propias reservas.

## Base de datos

Se incluye diseño SQL inicial en:

- `database/schema.sql`
- `database/seed.sql`

### Recomendación técnica

- Motor recomendado: **PostgreSQL 14+**.
- Backend recomendado: Node.js (NestJS/Express) o Django/FastAPI.
- Frontend recomendado: React/Next.js.

## Primeros pasos

1. Crear base de datos PostgreSQL.
2. Ejecutar `database/schema.sql`.
3. Ejecutar `database/seed.sql`.
4. Implementar backend basado en los módulos del documento `docs/backend-modules.md`.

## Estructura actual

- `database/` → Esquema y datos semilla.
- `docs/` → Diseño funcional, módulos y endpoints sugeridos.
