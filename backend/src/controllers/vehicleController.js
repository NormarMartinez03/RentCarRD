import { query } from '../config/db.js';

export async function listVehicles(req, res) {
  try {
    const { categoryId, status, branchId } = req.query;

    const conditions = [];
    const params = [];

    if (categoryId) {
      params.push(categoryId);
      conditions.push(`v.category_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`v.status = $${params.length}`);
    }
    if (branchId) {
      params.push(branchId);
      conditions.push(`v.branch_id = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT v.id, v.plate_number, v.brand, v.model, v.year, v.status, v.daily_rate,
              c.name AS category, b.name AS branch
       FROM vehicles v
       INNER JOIN categories c ON c.id = v.category_id
       INNER JOIN branches b ON b.id = v.branch_id
       ${whereClause}
       ORDER BY v.created_at DESC`,
      params
    );

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error listando vehículos', error: error.message });
  }
}

export async function createVehicle(req, res) {
  try {
    const {
      categoryId,
      branchId,
      plateNumber,
      brand,
      model,
      year,
      transmission,
      seats,
      fuelType,
      color,
      dailyRate
    } = req.body;

    if (!categoryId || !branchId || !plateNumber || !brand || !model || !year || !transmission || !seats || !fuelType || !dailyRate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para crear vehículo' });
    }

    const result = await query(
      `INSERT INTO vehicles (
          category_id, branch_id, plate_number, brand, model, year,
          transmission, seats, fuel_type, color, status, daily_rate
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'available',$11)
       RETURNING id, plate_number, brand, model, year, status, daily_rate`,
      [categoryId, branchId, plateNumber, brand, model, year, transmission, seats, fuelType, color || null, dailyRate]
    );

    return res.status(201).json({ message: 'Vehículo creado', vehicle: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Error creando vehículo', error: error.message });
  }
}

export async function activeReservations(req, res) {
  try {
    const result = await query(
      `SELECT r.id, r.start_date, r.end_date, r.status,
              c.full_name AS customer_name,
              v.plate_number, v.brand, v.model
       FROM reservations r
       INNER JOIN customers c ON c.id = r.customer_id
       INNER JOIN vehicles v ON v.id = r.vehicle_id
       WHERE r.status IN ('confirmed', 'active')
       ORDER BY r.start_date ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error listando reservas activas', error: error.message });
  }
}
