import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import type { LoginDto, RegisterDto } from "./auth.dto";

export interface AuthPair {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: "USER" | "ADMIN";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService
  ) {}

  async register(dto: RegisterDto): Promise<{ user: PublicUser; pair: AuthPair }> {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Email already registered");

    const user = await this.prisma.user.create({
      data: {
        email,
        displayName: dto.displayName,
        passwordHash: await this.passwords.hash(dto.password),
      },
    });
    return { user: toPublic(user), pair: await this.issuePair(user) };
  }

  async login(dto: LoginDto): Promise<{ user: PublicUser; pair: AuthPair }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    // Same generic error for unknown email and wrong password (no enumeration).
    if (!user || !(await this.passwords.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return { user: toPublic(user), pair: await this.issuePair(user) };
  }

  /** Rotates the refresh token (old jti consumed, new one issued). */
  async refresh(refreshToken: string | undefined): Promise<AuthPair> {
    if (!refreshToken) throw new UnauthorizedException("Missing refresh token");
    const { claims } = await this.tokens.resolveRefreshToken(refreshToken);
    await this.tokens.consumeRefreshToken(claims.sub, claims.jti);

    const user = await this.prisma.user.findUnique({ where: { id: claims.sub } });
    if (!user) throw new UnauthorizedException("User no longer exists");
    return this.issuePair(user);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) return;
    try {
      const { claims } = await this.tokens.resolveRefreshToken(refreshToken);
      await this.tokens.consumeRefreshToken(claims.sub, claims.jti);
    } catch {
      // Already invalid/expired — logout is idempotent.
    }
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return toPublic(user);
  }

  private async issuePair(user: User): Promise<AuthPair> {
    const claims = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: await this.tokens.signAccessToken(claims),
      refreshToken: await this.tokens.issueRefreshToken(claims),
    };
  }
}

function toPublic(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
  };
}
