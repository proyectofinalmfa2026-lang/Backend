import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'User not authenticated',
      );
    }

    if (!user.isPremium) {
      throw new ForbiddenException(
        'This feature is available only for Premium users',
      );
    }

    return true;
  }
}