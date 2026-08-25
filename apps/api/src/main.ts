import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { AppModule } from "./app.module";

async function ensureAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 8) return;

  const prisma = new PrismaClient();
  try {
    const { hash } = await import("argon2");
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: await hash(password),
        displayName: "Admin",
        role: "ADMIN",
      },
    });
    console.log(`[seed] admin ready: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    })
  );
  app.enableCors({
    origin: (process.env.WEB_ORIGIN ?? "http://localhost:3000").split(","),
    credentials: true,
  });

  await ensureAdmin().catch((e) => console.error("[seed] skipped:", e.message));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
