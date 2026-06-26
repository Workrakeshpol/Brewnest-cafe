import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { prisma } from '../config/database.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { successResponse } from '../utils/response.js';

// --- Zod Validation Schemas ---

export const createReservationSchema = z.object({
  guestName: z.string().min(1, 'Name is required').max(200),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().max(20).optional().nullable(),
  partySize: z.number().int().positive('Party size must be at least 1'),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Start time must be in HH:MM format'),
  specialRequests: z.string().optional().nullable(),
});

// --- Controller Methods ---

/**
 * Place a table reservation.
 * Performs real-time conflict checking against tables and existing bookings.
 */
export async function createReservation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id || null;
    const {
      guestName,
      guestEmail,
      guestPhone,
      partySize,
      reservationDate,
      startTime,
      specialRequests,
    } = req.body;

    // 1. Estimate end time (default to 2 hours reservation slot)
    const [startHour, startMin] = startTime.split(':').map(Number);
    if (startHour === undefined || startMin === undefined) {
      throw new ValidationError('Invalid start time format');
    }
    const endHour = (startHour + 2) % 24;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
    const formattedStartTime = `${startTime}:00`;

    // 2. Query all active tables that can support this party size
    const availableTables = await prisma.cafeTable.findMany({
      where: {
        capacity: { gte: partySize },
        isActive: true,
      },
      orderBy: { capacity: 'asc' },
    });

    if (availableTables.length === 0) {
      throw new ValidationError(`Sorry, we do not have a table that can accommodate a party of ${partySize}.`);
    }

    // 3. Find a table with no booking conflicts
    let assignedTableId: string | null = null;
    let assignedTableNumber: number | null = null;

    for (const table of availableTables) {
      // Check if there is an overlapping reservation for this table
      // Overlap logic: (StartA < EndB) AND (EndA > StartB)
      const conflicts = await prisma.$queryRaw<any[]>`
        SELECT id FROM reservations 
        WHERE table_id = ${table.id}::uuid
          AND reservation_date = ${reservationDate}::date
          AND status = 'confirmed'
          AND start_time < ${endTime}::time
          AND end_time > ${formattedStartTime}::time
        LIMIT 1
      `;

      if (conflicts.length === 0) {
        assignedTableId = table.id;
        assignedTableNumber = table.tableNumber;
        break; // found an available table!
      }
    }

    if (!assignedTableId) {
      throw new ValidationError('No tables are available for the requested time slot. Please try another time.');
    }

    // 4. Create reservation
    // Create Date objects representing date, start_time, and end_time
    const resDate = new Date(`${reservationDate}T00:00:00Z`);
    const sTime = new Date(`1970-01-01T${formattedStartTime}Z`);
    const eTime = new Date(`1970-01-01T${endTime}Z`);

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        tableId: assignedTableId,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
        partySize,
        reservationDate: resDate,
        startTime: sTime,
        endTime: eTime,
        specialRequests: specialRequests || null,
        status: 'confirmed',
      },
    });

    successResponse(res, {
      ...reservation,
      tableNumber: assignedTableNumber,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * List reservations for the authenticated user.
 */
export async function getMyReservations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError('Authentication required');
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: {
        table: true,
      },
      orderBy: { reservationDate: 'desc' },
    });

    const formatted = reservations.map(r => ({
      id: r.id,
      guestName: r.guestName,
      guestEmail: r.guestEmail,
      guestPhone: r.guestPhone,
      partySize: r.partySize,
      reservationDate: r.reservationDate,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status,
      specialRequests: r.specialRequests,
      createdAt: r.createdAt,
      tableNumber: r.table?.tableNumber ?? null,
      tableLocation: r.table?.location ?? null,
    }));

    successResponse(res, formatted);
  } catch (error) {
    next(error);
  }
}

/**
 * List all reservations (Staff+).
 */
export async function getAdminReservations(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        table: true,
      },
      orderBy: [
        { reservationDate: 'asc' },
        { startTime: 'asc' },
      ],
    });

    const formatted = reservations.map(r => ({
      id: r.id,
      guestName: r.guestName,
      guestEmail: r.guestEmail,
      guestPhone: r.guestPhone,
      partySize: r.partySize,
      reservationDate: r.reservationDate,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status,
      specialRequests: r.specialRequests,
      createdAt: r.createdAt,
      tableNumber: r.table?.tableNumber ?? null,
      tableLocation: r.table?.location ?? null,
    }));

    successResponse(res, formatted);
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel a reservation (User or Staff).
 */
export async function cancelReservation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    
    const reservation = await prisma.reservation.findUnique({
      where: { id: id as string },
    });

    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    // Check ownership if customer
    if (req.user?.role === 'customer' && reservation.userId !== req.user.id) {
      throw new ValidationError('You do not have permission to cancel this reservation');
    }

    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled', updatedAt: new Date() },
    });

    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}
