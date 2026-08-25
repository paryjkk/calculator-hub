import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { JwtAuthGuard, RolesGuard, type AuthedRequest } from "../../auth/auth.guard";
import { Roles } from "../../auth/roles.decorator";
import { PrismaService } from "../../prisma/prisma.service";

export class OverrideDto {
  @IsOptional() @IsString() @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(200) titleAr?: string;
  @IsOptional() @IsString() @MaxLength(300) shortEn?: string;
  @IsOptional() @IsString() @MaxLength(300) shortAr?: string;
  @IsOptional() @IsString() @MaxLength(1000) descEn?: string;
  @IsOptional() @IsString() @MaxLength(1000) descAr?: string;
  @IsOptional() @IsBoolean() hidden?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class RoleDto {
  @IsIn(["USER", "ADMIN"]) role!: "USER" | "ADMIN";
}

export const SETTING_KEYS = [
  "siteNameEn",
  "siteNameAr",
  "adsenseClient",
  "adsenseSlotTop",
  "adsenseSlotBottom",
  "contactEmail",
] as const;

export class SettingDto {
  @IsIn(SETTING_KEYS as unknown as string[]) key!: string;
  @IsString() @MaxLength(500) value!: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const now = Date.now();
    const since7d = new Date(now - 7 * 864e5);
    const [totalCalculations, totalUsers, newUsers7d] = await Promise.all([
      this.prisma.usageEvent.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    ]);

    const events = await this.prisma.usageEvent.findMany({
      where: { createdAt: { gte: new Date(now - 30 * 864e5) } },
      select: { slug: true, createdAt: true },
    });

    const byDay = new Map<string, number>();
    for (let d = 6; d >= 0; d--) {
      byDay.set(new Date(now - d * 864e5).toISOString().slice(0, 10), 0);
    }
    const bySlug = new Map<string, number>();
    for (const e of events) {
      const day = e.createdAt.toISOString().slice(0, 10);
      if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
      bySlug.set(e.slug, (bySlug.get(e.slug) ?? 0) + 1);
    }

    return {
      totalCalculations,
      totalUsers,
      newUsers7d,
      last7days: [...byDay.entries()].map(([day, count]) => ({ day, count })),
      topCalculators: [...bySlug.entries()]
        .map(([slug, count]) => ({ slug, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    };
  }

  overrides() {
    return this.prisma.calculatorOverride.findMany();
  }

  async putOverride(slug: string, dto: OverrideDto) {
    const data = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined)
    );
    return this.prisma.calculatorOverride.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }

  async deleteOverride(slug: string) {
    await this.prisma.calculatorOverride.deleteMany({ where: { slug } });
    return { ok: true };
  }

  users(query: string | undefined, page: number) {
    return this.prisma.user.findMany({
      where: query
        ? { email: { contains: query.toLowerCase(), mode: "insensitive" } }
        : undefined,
      select: {
        id: true, email: true, displayName: true, role: true,
        createdAt: true, _count: { select: { savedCalculations: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
      skip: Math.max(0, page - 1) * 25,
    });
  }

  async setRole(id: string, role: "USER" | "ADMIN", actingUserId: string) {
    if (id === actingUserId && role !== "ADMIN") {
      throw new ForbiddenException("You cannot demote yourself");
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return this.prisma.user.update({ where: { id }, data: { role } });
  }

  async deleteUser(id: string, actingUserId: string) {
    if (id === actingUserId) throw new ForbiddenException("You cannot delete yourself");
    await this.prisma.user.delete({ where: { id } }).catch(() => {
      throw new NotFoundException();
    });
    return { ok: true };
  }

  settings() {
    return this.prisma.siteSetting.findMany();
  }

  async putSetting(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  messages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async markMessage(id: string, handled: boolean) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { handled },
    }).catch(() => {
      throw new NotFoundException();
    });
  }
}

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("stats") stats(@Req() _req: AuthedRequest) { return this.admin.stats(); }
  @Get("overrides") overrides() { return this.admin.overrides(); }

  @Put("overrides/:slug")
  putOverride(@Param("slug") slug: string, @Body() dto: OverrideDto) {
    return this.admin.putOverride(slug, dto);
  }

  @Delete("overrides/:slug")
  deleteOverride(@Param("slug") slug: string) {
    return this.admin.deleteOverride(slug);
  }

  @Get("users")
  users(@Query("query") query?: string, @Query("page") page = "1") {
    return this.admin.users(query, Math.max(1, parseInt(page, 10) || 1));
  }

  @Patch("users/:id/role")
  setRole(
    @Req() req: AuthedRequest,
    @Param("id") id: string,
    @Body() dto: RoleDto
  ) {
    return this.admin.setRole(id, dto.role, req.user!.sub);
  }

  @Delete("users/:id")
  deleteUser(@Req() req: AuthedRequest, @Param("id") id: string) {
    return this.admin.deleteUser(id, req.user!.sub);
  }

  @Get("settings") settings() { return this.admin.settings(); }

  @Put("settings")
  putSetting(@Body() dto: SettingDto) {
    return this.admin.putSetting(dto.key, dto.value);
  }

  @Get("messages") messages() { return this.admin.messages(); }

  @Patch("messages/:id")
  markMessage(@Param("id") id: string, @Body() body: { handled: boolean }) {
    if (typeof body?.handled !== "boolean") throw new BadRequestException();
    return this.admin.markMessage(id, body.handled);
  }
}

@Module({

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}



