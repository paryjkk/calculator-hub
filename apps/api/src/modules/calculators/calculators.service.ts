import { BadRequestException, Injectable } from "@nestjs/common";
import { age, amortization, loanPayment, retirement } from "@calc/engine";
import type {
  AgeDto,
  LoanPaymentDto,
  RetirementDto,
} from "./calculators.dto";

@Injectable()
export class CalculatorsService {
  loanPayment(dto: LoanPaymentDto) {
    return loanPayment(dto);
  }

  amortization(dto: LoanPaymentDto) {
    return amortization(dto);
  }

  age(dto: AgeDto) {
    const onDate = dto.onDate ?? new Date().toISOString().slice(0, 10);
    if (dto.birthDate > onDate) {
      throw new BadRequestException("birthDate must be on or before onDate");
    }
    return age({ birthDate: dto.birthDate, onDate });
  }

  retirement(dto: RetirementDto) {
    if (dto.retirementAge <= dto.currentAge) {
      throw new BadRequestException(
        "retirementAge must be greater than currentAge"
      );
    }
    return retirement(dto);
  }
}
