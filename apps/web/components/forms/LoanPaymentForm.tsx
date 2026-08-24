"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LIMITS } from "@calc/shared";
import { fmtUsd, postCalculator, type LoanPaymentResult } from "@/lib/api";
import { ErrorAlert, NumberInput, ResultGrid, Stat, SubmitButton } from "./ui";

const schema = z.object({
  principal: z.coerce
    .number()
    .positive("Principal must be greater than zero")
    .max(LIMITS.maxPrincipal),
  annualRatePct: z.coerce.number().min(0).max(LIMITS.maxRatePct),
  years: z.coerce
    .number()
    .int("Years must be a whole number")
    .min(1)
    .max(LIMITS.maxYears),
});

type FormValues = z.infer<typeof schema>;

export default function LoanPaymentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { principal: 200000, annualRatePct: 6.5, years: 30 },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      postCalculator<FormValues, LoanPaymentResult>("loan-payment", values),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="space-y-4"
      noValidate
    >
      <NumberInput label="Loan amount" registration={register("principal")} error={errors.principal} step={1000} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Annual interest rate" registration={register("annualRatePct")} error={errors.annualRatePct} step={0.1} suffix="%" />
        <NumberInput label="Term" registration={register("years")} error={errors.years} suffix="years" />
      </div>

      <SubmitButton pending={mutation.isPending} />

      {mutation.isError && <ErrorAlert message={(mutation.error as Error).message} />}

      {mutation.data && (
        <ResultGrid>
          <Stat label="Monthly payment" value={fmtUsd(mutation.data.monthlyPayment)} highlight />
          <Stat label="Total paid" value={fmtUsd(mutation.data.totalPaid)} />
          <Stat label="Total interest" value={fmtUsd(mutation.data.totalInterest)} />
        </ResultGrid>
      )}
    </form>
  );
}
