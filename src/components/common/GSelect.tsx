"use client";

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { cn } from "@/lib/global.utils";

type Option = {
  label: string;
  value: string;
};

type ISelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Radix Select uses string values; set true when the form field is a number (e.g. id). */
  valueAsNumber?: boolean;
  /** Shows a spinner in the trigger while options are being fetched. */
  loading?: boolean;
  loadingPlaceholder?: string;
};

function FormSelectBody<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  disabled,
  required,
  valueAsNumber = false,
  loading = false,
  loadingPlaceholder = "Loading...",
}: ISelectProps<T>): ReactElement {
  const isBusy = loading || disabled;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}

          <Select
            onValueChange={
              valueAsNumber ? (v) => field.onChange(Number(v)) : field.onChange
            }
            // value={
            //   loading
            //     ? undefined
            //     : valueAsNumber
            //       ? typeof field.value === "number" && field.value > 0
            //         ? String(field.value)
            //         : undefined
            //       : field.value != null && field.value !== ""
            //         ? String(field.value)
            //         : undefined
            // }
            value={
              field.value !== undefined && field.value !== null && field.value !== ""
                ? String(field.value)
                : undefined
            }
            disabled={isBusy}
          >
            <SelectTrigger
              className={cn(
                "w-full min-w-[12rem]",
                loading && "cursor-wait text-muted-foreground"
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    className="size-4 shrink-0 animate-spin"
                    aria-hidden
                  />
                  <span>{loadingPlaceholder}</span>
                </span>
              ) : (
                <SelectValue placeholder={placeholder} />
              )}
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Trailing comma in `<T …,>` is required in `.tsx` so `<` is not parsed as JSX. */
export const FormSelect = <T extends FieldValues>(
  props: ISelectProps<T>
): ReactElement => FormSelectBody(props);

const GSelect = {
  Form: FormSelect,
};

export default GSelect;
