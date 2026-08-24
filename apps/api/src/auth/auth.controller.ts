import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  TokenService,
} from "./token.service";
import { AuthService, type AuthPair } from "./auth.service";
import { JwtAuthGuard, RolesGuard, type AuthedRequest } from "./auth.guard";
import { Roles } from "./roles.decorator";
import { LoginDto, RegisterDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService
  ) {}

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, pair } = await this.auth.register(dto);
    this.setCookies(res, pair);
    return { user };
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { user, pair } = await this.auth.login(dto);
    this.setCookies(res, pair);
    return { user };
  }

  @Post("refresh")
  async refresh(
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const pair = await this.auth.refresh(req.cookies?.[REFRESH_COOKIE]);
    this.setCookies(res, pair);
    return { ok: true };
  }

  @Post("logout")
  async logout(
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE]);
    this.clearCookies(res);
    return { ok: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthedRequest) {
    return this.auth.me(req.user!.sub);
  }

  /** RBAC smoke route — proves RolesGuard wiring (remove when admin panel lands). */
  @Get("admin-only")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  adminOnly() {
    return { ok: true };
  }

  private cookieOptions(kind: "access" | "refresh") {
    return TokenService.cookieOptions(kind);
  }

  private setCookies(res: Response, pair: AuthPair): void {
    res.cookie(ACCESS_COOKIE, pair.accessToken, this.cookieOptions("access"));
    res.cookie(REFRESH_COOKIE, pair.refreshToken, this.cookieOptions("refresh"));
  }

  private clearCookies(res: Response): void {
    res.clearCookie(ACCESS_COOKIE, this.cookieOptions("access"));
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions("refresh"));
  }
}
