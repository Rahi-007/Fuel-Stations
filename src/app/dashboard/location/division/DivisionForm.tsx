"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { urlWithState } from "@/lib/global.utils";
import { Button } from "@/components/ui/button";
import type { IDivision } from "@/interface/division.interface";
import { addDivision, editDivision } from "@/service/division.service";
import { zodResolver } from "@hookform/resolvers/zod";
import useAsyncAction from "@/hooks/useAsyncAction";
import GCheckbox from "@/components/common/GCheckbox";
import GTextarea from "@/components/common/GTextArea";
import GInput from "@/components/common/GInput";

const divisionFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

interface IProps {
  defaultValues?: IDivision;
}

export type DivisionFormValues = z.infer<typeof divisionFormSchema>;

export default function DivisionForm(props: IProps) {
  const router = useRouter();
  const fnAddDivision = useAsyncAction(addDivision);
  const fnEditDivision = useAsyncAction(editDivision);

  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      name: props.defaultValues?.name || "",
      description: props.defaultValues?.description || "",
      isActive: props.defaultValues?.isActive || true,
    },
  });

  function onSubmit(values: DivisionFormValues) {
    if (props.defaultValues) {
      fnEditDivision
        .action(props.defaultValues.id, values)
        .then(() => {
          toast.success("Division updated successfully");
          router.push(
            urlWithState(`/location/division/${props.defaultValues!.id}`)
          );
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      fnAddDivision
        .action(values)
        .then(() => {
          toast.success("Division added successfully");
          form.reset();
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <GInput.Form
          control={form.control}
          name="name"
          label="Name"
          placeholder="Rajshahi"
        />

        <GTextarea.Form
          control={form.control}
          name="description"
          label="Description"
          placeholder="Optional notes"
          rows={3}
        />

        <GCheckbox.Form control={form.control} name="isActive" label="Active" />

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Add Division"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
