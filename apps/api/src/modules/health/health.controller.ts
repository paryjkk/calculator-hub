import { Controller, Get } from "@nestjs/common";
import { API_VERSION } from "@calc/shared";

@Controller("health")
export class HealthController {
  @Get()
  check(): { status: string; version: string } {
    return { status: "ok", version: API_VERSION };
  }
}
