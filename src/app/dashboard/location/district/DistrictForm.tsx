"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { IDistrict } from "@/interface/district.interface";
import { addDistrict, editDistrict } from "@/service/district.service";
import { loadDivisions } from "@/service/division.service";
import { urlWithState } from "@/lib/global.utils";
import useAsyncAction from "@/hooks/useAsyncAction";
import GInput from "@/components/common/GInput";
import GTextarea from "@/components/common/GTextArea";
import GCheckbox from "@/components/common/GCheckbox";
import GSelect from "@/components/common/GSelect";

const districtFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  divisionId: z.number().refine((n) => n > 0, "Select a division"),
  isActive: z.boolean(),
});

export type DistrictFormValues = z.infer<typeof districtFormSchema>;

interface IProps {
  defaultValues?: IDistrict;
}

export default function DistrictForm(props: IProps) {
  const router = useRouter();
  const fnAddDistrict = useAsyncAction(addDistrict);
  const fnEditDistrict = useAsyncAction(editDistrict);
  const fnLoadDivisions = useAsyncAction(loadDivisions);

  const form = useForm<DistrictFormValues>({
    resolver: zodResolver(districtFormSchema),
    defaultValues: {
      name: props.defaultValues?.name || "",
      description: props.defaultValues?.description || "",
      divisionId: props.defaultValues?.division?.id || 0,
      isActive: props.defaultValues?.isActive || true,
    },
  });

  useEffect(() => {
    fnLoadDivisions.action();
  }, []);

  function onSubmit(values: DistrictFormValues) {
    if (props.defaultValues) {
      fnEditDistrict
        .action(props.defaultValues.id, values)
        .then(() => {
          toast.success("District updated successfully");
          router.push(
            urlWithState(`/location/district/${props.defaultValues!.id}`)
          );
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      fnAddDistrict
        .action(values)
        .then(() => {
          toast.success("District added successfully");
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
        className="max-w-lg space-y-6"
      >
        <GInput.Form
          control={form.control}
          name="name"
          label="Name"
          placeholder="Rajshahi"
        />

        <GSelect.Form
          control={form.control}
          name="divisionId"
          label="Division"
          placeholder="Select Division"
          valueAsNumber
          loading={fnLoadDivisions.onLoading}
          loadingPlaceholder="Loading divisions..."
          options={
            fnLoadDivisions.data?.map((division) => ({
              label: division.name,
              value: String(division.id),
            })) ?? []
          }
        />

        <GTextarea.Form
          control={form.control}
          name="description"
          label="Description"
          placeholder="Optional notes"
          rows={3}
        />

        <GCheckbox.Form control={form.control} name="isActive" label="Active" />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {props.defaultValues?.id ? "Update District" : "Add District"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
