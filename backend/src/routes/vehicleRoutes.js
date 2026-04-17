import { Router } from 'express';
import { activeReservations, createVehicle, listVehicles } from '../controllers/vehicleController.js';
import { requireAuth, requirePermission, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', listVehicles);
router.post('/', requireAuth, requireRole('ADMIN', 'MANAGER'), requirePermission('vehicle.create'), createVehicle);
router.get('/active-reservations', requireAuth, requireRole('ADMIN', 'MANAGER', 'AGENT'), requirePermission('reservation.active.read'), activeReservations);

export default router;
