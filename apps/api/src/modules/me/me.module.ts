import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Module,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IsIn, IsObject, IsString, MaxLength, MinLength } from "class-validator";
import type { Prisma } from "@prisma/client";
import { CALCULATOR_DEFS } from "@calc/shared";
import { JwtAuthGuard, type AuthedRequest } from "../../auth/auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

export class SaveCalculationDto {
  @IsIn(CALCULATOR_DEFS.map((d) => d.slug))
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @IsObject()
  inputs!: Record<string, unknown>;

  @IsObject()
  result!: Record<string, unknown>;
}

@Controller("me/calculations")
@UseGuards(JwtAuthGuard)
export class MeCalculationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@Req() req: AuthedRequest) {
    return this.prisma.savedCalculation.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  @Post()
  async create(@Req() req: AuthedRequest, @Body() dto: SaveCalculationDto) {
    return this.prisma.savedCalculation.create({
      data: {
        userId: req.user!.sub,
        slug: dto.slug,
        name: dto.name,
        inputs: dto.inputs as Prisma.InputJsonValue,
        result: dto.result as Prisma.InputJsonValue,
      },
    });
  }

  @Delete(":id")
  async remove(@Req() req: AuthedRequest, @Param("id") id: string) {
    await this.prisma.savedCalculation.deleteMany({
      where: { id, userId: req.user!.sub },
    });
    return { ok: true };
  }
}

@Module({
  controllers: [MeCalculationsController],
})
export class MeModule {}


