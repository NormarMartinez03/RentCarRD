import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

export function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const roleResult = await query(
        `SELECT r.code
         FROM users u
         INNER JOIN roles r ON r.id = u.role_id
         WHERE u.id = $1`,
        [req.user.userId]
      );

      if (roleResult.rowCount === 0) {
        return res.status(403).json({ message: 'Usuario sin rol válido' });
      }

      const role = roleResult.rows[0].code;
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'No tienes permisos para esta acción' });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Error validando rol', error: error.message });
    }
  };
}

export function requirePermission(permissionCode) {
  return async (req, res, next) => {
    try {
      const permissionResult = await query(
        `SELECT 1
         FROM users u
         INNER JOIN role_permissions rp ON rp.role_id = u.role_id
         INNER JOIN permissions p ON p.id = rp.permission_id
         WHERE u.id = $1 AND p.code = $2`,
        [req.user.userId, permissionCode]
      );

      if (permissionResult.rowCount === 0) {
        return res.status(403).json({ message: 'Permiso insuficiente' });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Error validando permisos', error: error.message });
    }
  };
}
