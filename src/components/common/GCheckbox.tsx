"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type ICheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
};

function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: ICheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0">
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            id={name}
          />

          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const GCheckbox = {
  Form: FormCheckbox,
};

export default GCheckbox;
