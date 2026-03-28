"use client";

import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import { Input, InputProps } from "../ui/input";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

type IFormProps<T extends FieldValues> = InputProps & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
};

function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  readonly,
  required,
  type = "text",
  ...rest
}: IFormProps<T>) {
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

          <Input
            {...field}
            {...rest}
            id={name}
            type={type}
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

const GInput = {
  Form: FormInput,
};

export default GInput;
