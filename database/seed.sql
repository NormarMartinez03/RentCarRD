-- Roles
INSERT INTO roles (code, name) VALUES
('ADMIN', 'Administrador'),
('MANAGER', 'Gerente Operativo'),
('AGENT', 'Agente de Reservas'),
('CUSTOMER', 'Cliente');

-- Permissions
INSERT INTO permissions (code, description) VALUES
('vehicle.create', 'Crear vehículos'),
('vehicle.update', 'Actualizar vehículos'),
('vehicle.read', 'Consultar vehículos'),
('vehicle.delete', 'Eliminar vehículos'),
('reservation.create', 'Crear reservas'),
('reservation.update', 'Actualizar reservas'),
('reservation.read', 'Consultar reservas'),
('reservation.cancel', 'Cancelar reservas'),
('reservation.active.read', 'Consultar reservas activas'),
('category.manage', 'Gestionar categorías'),
('user.manage', 'Gestionar usuarios y roles'),
('report.read', 'Ver reportes'),
('payment.manage', 'Gestionar pagos'),
('maintenance.manage', 'Gestionar mantenimientos');

-- Role permission assignments
-- ADMIN (all)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'ADMIN';

-- MANAGER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'vehicle.read', 'vehicle.update', 'reservation.read', 'reservation.update',
  'reservation.active.read', 'report.read', 'maintenance.manage', 'payment.manage'
)
WHERE r.code = 'MANAGER';

-- AGENT
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'vehicle.read', 'reservation.create', 'reservation.read',
  'reservation.update', 'reservation.cancel', 'payment.manage'
)
WHERE r.code = 'AGENT';

-- CUSTOMER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'reservation.create', 'reservation.read', 'reservation.cancel'
)
WHERE r.code = 'CUSTOMER';

-- Basic branches
INSERT INTO branches (name, city, address, phone) VALUES
('Sucursal Santo Domingo Centro', 'Santo Domingo', 'Av. Winston Churchill #101', '+1-809-000-0001'),
('Sucursal Punta Cana', 'Punta Cana', 'Boulevard Turístico del Este #22', '+1-809-000-0002');

-- Basic categories
INSERT INTO categories (name, description, base_daily_rate) VALUES
('Económico', 'Carros compactos con bajo consumo', 35.00),
('SUV', 'Vehículos utilitarios deportivos', 70.00),
('Lujo', 'Vehículos premium', 120.00),
('Pickup', 'Camionetas para carga ligera', 80.00),
('Minivan', 'Vehículos familiares de alta capacidad', 85.00);
