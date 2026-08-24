import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { ACCESS_COOKIE, TokenService, type AccessClaims } from "./token.service";
import { ROLES_KEY } from "./roles.decorator";

export interface AuthedRequest extends Request {
  user?: AccessClaims;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token || typeof token !== "string") {
      throw new UnauthorizedException("Missing access token");
    }
    try {
      req.user = await this.tokens.verifyAccessToken(token);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<
      Array<"USER" | "ADMIN">
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<AuthedRequest>();
    if (!user) throw new UnauthorizedException();
    if (!required.includes(user.role)) throw new ForbiddenException("Insufficient role");
    return true;
  }
}
