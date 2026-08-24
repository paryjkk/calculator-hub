import { Body, Controller, Post } from "@nestjs/common";
import { AgeDto, LoanPaymentDto, RetirementDto } from "./calculators.dto";
import { CalculatorsService } from "./calculators.service";

@Controller("calculators")
export class CalculatorsController {
  constructor(private readonly calculators: CalculatorsService) {}

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
