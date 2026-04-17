import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

function signToken(userId, email, role) {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });
}

export async function register(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email y password son obligatorios' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Este email ya está registrado' });
    }

    const roleResult = await query('SELECT id, code FROM roles WHERE code = $1', ['CUSTOMER']);
    if (roleResult.rowCount === 0) {
      return res.status(500).json({ message: 'No existe el rol CUSTOMER en la base de datos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await query(
      `INSERT INTO users (role_id, full_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email`,
      [roleResult.rows[0].id, fullName, email, phone || null, passwordHash]
    );

    await query(
      `INSERT INTO customers (user_id, full_name, email, phone)
       VALUES ($1, $2, $3, $4)`,
      [userResult.rows[0].id, fullName, email, phone || null]
    );

    const token = signToken(userResult.rows[0].id, userResult.rows[0].email, roleResult.rows[0].code);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: userResult.rows[0].id,
        fullName: userResult.rows[0].full_name,
        email: userResult.rows[0].email,
        role: roleResult.rows[0].code
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error registrando usuario', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    const result = await query(
      `SELECT u.id, u.full_name, u.email, u.password_hash, r.code AS role
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1 AND u.is_active = TRUE`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = signToken(user.id, user.email, user.role);

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en login', error: error.message });
  }
}

export async function me(req, res) {
  try {
    const result = await query(
      `SELECT u.id, u.full_name, u.email, r.code AS role
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error obteniendo perfil', error: error.message });
  }
}
