"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LIMITS } from "@calc/shared";
import { fmtUsd, postCalculator } from "@/lib/api";
import { ErrorAlert, NumberInput, ResultGrid, Stat, SubmitButton } from "./ui";

interface AmortRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

interface AmortResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: AmortRow[];
}

const schema = z.object({
  principal: z.coerce.number().positive().max(LIMITS.maxPrincipal),
  annualRatePct: z.coerce.number().min(0).max(LIMITS.maxRatePct),
  years: z.coerce.number().int().min(1).max(LIMITS.maxYears),
});

type FormValues = z.infer<typeof schema>;

export default function AmortizationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { principal: 200000, annualRatePct: 6.5, years: 30 },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      postCalculator<FormValues, AmortResult>("loan-amortization", values),
  });

  const showAll = watch("years") !== undefined && mutation.data && mutation.data.schedule.length <= 60;

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <NumberInput label="Loan amount" registration={register("principal")} error={errors.principal} step={1000} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput label="Annual interest rate" registration={register("annualRatePct")} error={errors.annualRatePct} step={0.1} suffix="%" />
        <NumberInput label="Term" registration={register("years")} error={errors.years} suffix="years" />
      </div>

      <SubmitButton pending={mutation.isPending}>Build schedule</SubmitButton>

      {mutation.isError && <ErrorAlert message={(mutation.error as Error).message} />}

      {mutation.data && (
        <>
          <ResultGrid>
            <Stat label="Monthly payment" value={fmtUsd(mutation.data.monthlyPayment)} highlight />
            <Stat label="Total paid" value={fmtUsd(mutation.data.totalPaid)} />
            <Stat label="Total interest" value={fmtUsd(mutation.data.totalInterest)} />
          </ResultGrid>

          <div className="max-h-[28rem] overflow-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[520px] text-right text-xs sm:text-sm">
              <caption className="sr-only">Amortization schedule</caption>
              <thead className="sticky top-0 bg-slate-100 text-slate-700">
                <tr>
                  <th scope="col" className="px-3 py-2">#</th>
                  <th scope="col" className="px-3 py-2">Payment</th>
                  <th scope="col" className="px-3 py-2">Interest</th>
                  <th scope="col" className="px-3 py-2">Principal</th>
                  <th scope="col" className="px-3 py-2">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(showAll ? mutation.data.schedule : mutation.data.schedule.slice(0, 12)).map((row) => (
                  <tr key={row.month} className="odd:bg-slate-50/60">
                    <td className="px-3 py-1.5 font-medium text-slate-500">{row.month}</td>
                    <td className="px-3 py-1.5">{fmtUsd(row.payment)}</td>
                    <td className="px-3 py-1.5 text-slate-500">{fmtUsd(row.interest)}</td>
                    <td className="px-3 py-1.5">{fmtUsd(row.principal)}</td>
                    <td className="px-3 py-1.5 font-semibold">{fmtUsd(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAll && (
            <p className="text-xs text-slate-400">
              Showing first 12 of {mutation.data.schedule.length.toLocaleString()} months.
            </p>
          )}
        </>
      )}
    </form>
  );
}
