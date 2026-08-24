"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LIMITS } from "@calc/shared";
import { fmtUsd, postCalculator, type RetirementResultDTO } from "@/lib/api";
import { ErrorAlert, NumberInput, ResultGrid, Stat, SubmitButton } from "./ui";

const schema = z
  .object({
    currentAge: z.coerce.number().int().min(0).max(LIMITS.maxAge),
    retirementAge: z.coerce.number().int().min(1).max(LIMITS.maxAge),
    currentSavings: z.coerce.number().min(0),
    annualContribution: z.coerce.number().min(0),
    expectedReturnPct: z.coerce.number().min(0).max(LIMITS.maxRatePct),
    inflationPct: z.coerce.number().min(0).max(LIMITS.maxRatePct),
  })
  .refine((v) => v.retirementAge > v.currentAge, {
    message: "Retirement age must be greater than current age",
    path: ["retirementAge"],
  });

type FormValues = z.infer<typeof schema>;

export default function RetirementForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 50000,
      annualContribution: 12000,
      expectedReturnPct: 7,
      inflationPct: 2.5,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      postCalculator<FormValues, RetirementResultDTO>("retirement", values),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Current age" registration={register("currentAge")} error={errors.currentAge} />
        <NumberInput label="Retirement age" registration={register("retirementAge")} error={errors.retirementAge} />
        <NumberInput label="Current savings" registration={register("currentSavings")} error={errors.currentSavings} step={1000} />
        <NumberInput label="Annual contribution" registration={register("annualContribution")} error={errors.annualContribution} step={500} suffix="added at year-end" />
        <NumberInput label="Expected annual return" registration={register("expectedReturnPct")} error={errors.expectedReturnPct} step={0.5} suffix="%" />
        <NumberInput label="Expected inflation" registration={register("inflationPct")} error={errors.inflationPct} step={0.1} suffix="%" />
      </div>

      <SubmitButton pending={mutation.isPending}>Project retirement</SubmitButton>

      {mutation.isError && <ErrorAlert message={(mutation.error as Error).message} />}

      {mutation.data && (
        <>
          <ResultGrid>
            <Stat label="Projected balance (nominal)" value={fmtUsd(mutation.data.projectedNominal)} highlight />
            <Stat label="In today's money (real)" value={fmtUsd(mutation.data.projectedReal)} />
            <Stat label="Total contributions" value={fmtUsd(mutation.data.totalContributions)} />
          </ResultGrid>
          <p className="text-xs text-slate-400">
            Over {mutation.data.yearsToRetirement} years, compounded annually.
          </p>
        </>
      )}
    </form>
  );
}
