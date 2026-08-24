import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { AgeDto, LoanPaymentDto, RetirementDto } from "./calculators.dto";
import { CalculatorsService } from "./calculators.service";
import { CALCULATOR_DEFS } from "@calc/shared";

@Controller("calculators")
export class CalculatorsController {
  constructor(private readonly calculators: CalculatorsService) {}

  @Get()
  list() {
    return {
      count: CALCULATOR_DEFS.length,
      calculators: CALCULATOR_DEFS.map((d) => ({
        slug: d.slug,
        category: d.category,
        icon: d.icon,
      })),
    };
  }

  @Post(":slug/compute")
  compute(@Param("slug") slug: string, @Body() body: unknown) {
    return this.calculators.compute(slug, body);
  }

  @Post("loan-payment")
  loanPayment(@Body() dto: LoanPaymentDto) {
    return this.calculators.loanPayment(dto);
  }

  @Post("loan-amortization")
  amortization(@Body() dto: LoanPaymentDto) {
    return this.calculators.amortization(dto);
  }

  @Post("age")
  age(@Body() dto: AgeDto) {
    return this.calculators.age(dto);
  }

  @Post("retirement")
  retirement(@Body() dto: RetirementDto) {
    return this.calculators.retirement(dto);
  }
}
