import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { CalculatorsModule } from "./modules/calculators/calculators.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [PrismaModule, RedisModule, AuthModule, HealthModule, CalculatorsModule],
})
export class AppModule {}
