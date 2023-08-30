import { ForbiddenError } from '@casl/ability';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequiredRule, CHECK_ABILITY } from './abilities.decorator';
import { AbilityFactory } from './ability.factory';
import { IS_PUBLIC_KEY } from 'src/auth/SkipAuth.decorator';
import { Request } from 'express';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // aknowledge SkipAuth decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    const request: Request = context.switchToHttp().getRequest();

    const ability = await this.caslAbilityFactory.defineAbility({
      userId: request.user.id,
      orgId: request.params.orgId,
      projectId: request.params.projectId,
    });

    try {
      rules.forEach((rule) =>
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
      );

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
