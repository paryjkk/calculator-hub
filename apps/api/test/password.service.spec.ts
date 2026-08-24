import { describe, expect, it } from "vitest";
import { PasswordService } from "../src/auth/password.service";

describe("PasswordService (Argon2id)", () => {
  const service = new PasswordService();

  it("hashes and verifies a password", async () => {
    const hash = await service.hash("Sup3rSecret!");
    expect(hash).toMatch(/^\$argon2id\$/);
    expect(await service.verify(hash, "Sup3rSecret!")).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const hash = await service.hash("Sup3rSecret!");
    expect(await service.verify(hash, "wrong-password")).toBe(false);
  });

  it("produces unique hashes for identical passwords", async () => {
    const [a, b] = await Promise.all([
      service.hash("SamePassword1"),
      service.hash("SamePassword1"),
    ]);
    expect(a).not.toBe(b); // salted
  });
});
