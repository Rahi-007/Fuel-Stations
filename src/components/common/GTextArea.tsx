"use client";

import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Textarea, TextareaProps } from "../ui/textarea";

type ITextareaProps<T extends FieldValues> = TextareaProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
};

function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  readonly,
  required,
  ...rest
}: ITextareaProps<T>) {
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

          <Textarea
            {...field}
            {...rest}
            id={name}
            disabled={disabled}
            readOnly={readonly || disabled}
            value={field.value ?? ""}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const GTextarea = {
  Form: FormTextarea,
};

export default GTextarea;
