"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postCalculator, type AgeResultDTO } from "@/lib/api";
import { ErrorAlert, ResultGrid, Stat, SubmitButton, TextInput } from "./ui";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker (YYYY-MM-DD)");

const schema = z
  .object({
    birthDate: isoDate,
    onDate: z.union([z.literal(""), isoDate]).optional(),
  })
  .refine((v) => !v.onDate || v.birthDate <= v.onDate, {
    message: "Birth date must be on or before the reference date",
    path: ["onDate"],
  });

type FormValues = z.infer<typeof schema>;

export default function AgeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { birthDate: "1990-06-15", onDate: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      postCalculator<FormValues, AgeResultDTO>("age", {
        birthDate: values.birthDate,
        onDate: values.onDate ? values.onDate : undefined,
      }),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Date of birth" type="date" registration={register("birthDate")} error={errors.birthDate} />
        <TextInput
          label="Age at date (optional — defaults to today)"
          type="date"
          registration={register("onDate")}
          error={errors.onDate}
        />
      </div>

      <SubmitButton pending={mutation.isPending}>Calculate age</SubmitButton>

      {mutation.isError && <ErrorAlert message={(mutation.error as Error).message} />}

      {mutation.data && (
        <>
          <ResultGrid>
            <Stat
              label="Exact age"
              value={`${mutation.data.years}y ${mutation.data.months}m ${mutation.data.days}d`}
              highlight
            />
            <Stat label="Total months" value={mutation.data.totalMonths.toLocaleString()} />
            <Stat label="Total weeks" value={mutation.data.totalWeeks.toLocaleString()} />
            <Stat label="Total days" value={mutation.data.totalDays.toLocaleString()} />
          </ResultGrid>
          <p className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-600">
            🎉 Next birthday in{" "}
            <strong>{mutation.data.nextBirthdayInDays}</strong>{" "}
            {mutation.data.nextBirthdayInDays === 1 ? "day" : "days"}.
          </p>
        </>
      )}
    </form>
  );
}
