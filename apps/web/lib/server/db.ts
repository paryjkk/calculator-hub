import { PrismaClient } from "@prisma/client";

/**
 * Lazily-instantiated singleton: defers PrismaClient construction until the
 * first query so builds/prerendering never require DATABASE_URL.
 */
const globalForPrisma = globalThis as unknown as {
  __calcPrisma?: PrismaClient;
};

function create(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn"] : [],
  });
}

export const db: PrismaClient = new Proxy(
  {} as PrismaClient,
  {
    get(_target, prop, receiver) {
      if (!globalForPrisma.__calcPrisma)
        globalForPrisma.__calcPrisma = create();
      const client = globalForPrisma.__calcPrisma;
      const value = Reflect.get(client as object, prop, receiver);
      return typeof value === "function"
        ? (value as (...args: unknown[]) => unknown).bind(client)
        : value;
    },
  }
);
