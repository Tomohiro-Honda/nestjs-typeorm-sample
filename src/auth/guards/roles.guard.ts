import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const requiredStatus = this.reflector.get<string[]>(
      'statuses',
      ctx.getHandler(),
    );
    if (!requiredStatus) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    return requiredStatus.some((status) => user.status.includes(status));
  }
}
