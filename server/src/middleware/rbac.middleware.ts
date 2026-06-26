import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

const ROLE_LEVELS = {
  customer: 1,
  staff: 2,
  manager: 3,
  admin: 4,
} as const;

type Role = keyof typeof ROLE_LEVELS;

/**
 * Middleware to authorize requests based on user roles and a role hierarchy.
 * Hierarchy: admin > manager > staff > customer.
 * If a route requires 'staff', then 'staff', 'manager', and 'admin' can access it.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userRole = req.user.role as Role;
    const userLevel = ROLE_LEVELS[userRole] || 0;

    // The user has permission if their role level is greater than or equal to 
    // the level of any of the allowed roles.
    const hasPermission = allowedRoles.some((role) => {
      const requiredLevel = ROLE_LEVELS[role];
      return userLevel >= requiredLevel;
    });

    if (!hasPermission) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}
