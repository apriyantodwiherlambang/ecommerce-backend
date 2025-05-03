import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard'; // Ensure JwtAuthGuard is the authentication guard
import { Observable } from 'rxjs';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  // Inherit JwtAuthGuard for JWT auth check
  constructor(private readonly reflector: Reflector) {
    super(); // Call super to invoke the JwtAuthGuard constructor
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the roles required for the route from the metadata
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles are specified, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the current authenticated user from the request
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role matches any of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
