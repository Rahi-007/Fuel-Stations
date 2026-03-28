"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { ISubDistrict } from "@/interface/sub-district.interface";
import {
  addSubDistrict,
  editSubDistrict,
} from "@/service/sub-district.service";
import { loadDistricts } from "@/service/district.service";
import { urlWithState } from "@/lib/global.utils";
import useAsyncAction from "@/hooks/useAsyncAction";
import GInput from "@/components/common/GInput";
import GTextarea from "@/components/common/GTextArea";
import GCheckbox from "@/components/common/GCheckbox";
import GSelect from "@/components/common/GSelect";

const subDistrictFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  districtId: z.number().refine((n) => n > 0, "Select a district"),
  isActive: z.boolean(),
});

export type SubDistrictFormValues = z.infer<typeof subDistrictFormSchema>;

interface IProps {
  defaultValues?: ISubDistrict;
}

export default function SubDistrictForm(props: IProps) {
  const router = useRouter();
  const fnAddSubDistrict = useAsyncAction(addSubDistrict);
  const fnEditSubDistrict = useAsyncAction(editSubDistrict);
  const fnLoadDistricts = useAsyncAction(loadDistricts);

  const form = useForm<SubDistrictFormValues>({
    resolver: zodResolver(subDistrictFormSchema),
    defaultValues: {
      name: props.defaultValues?.name || "",
      description: props.defaultValues?.description || "",
      districtId: props.defaultValues?.district?.id || 0,
      isActive: props.defaultValues?.isActive ?? true,
    },
  });

  const districtOptions = useMemo(() => {
    const list = fnLoadDistricts.data ?? [];
    return [...list]
      .sort((a, b) => {
        const da = a.division?.name ?? "";
        const db = b.division?.name ?? "";
        if (da !== db) return da.localeCompare(db);
        return a.name.localeCompare(b.name);
      })
      .map((d) => ({
        label: d.division?.name ? `${d.division.name} — ${d.name}` : d.name,
        value: String(d.id),
      }));
  }, [fnLoadDistricts.data]);

  useEffect(() => {
    fnLoadDistricts.action();
  }, []);

  function onSubmit(values: SubDistrictFormValues) {
    if (props.defaultValues) {
      fnEditSubDistrict
        .action(props.defaultValues.id, values)
        .then(() => {
          toast.success("Sub-district updated successfully");
          router.push(
            urlWithState(`/location/sub-district/${props.defaultValues!.id}`)
          );
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      fnAddSubDistrict
        .action(values)
        .then(() => {
          toast.success("Sub-district added successfully");
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
          label="Name (upazila / sub-district)"
          placeholder="e.g. Kaliganj"
        />

        <GSelect.Form
          control={form.control}
          name="districtId"
          label="District"
          placeholder="Select district"
          valueAsNumber
          loading={fnLoadDistricts.onLoading}
          loadingPlaceholder="Loading districts..."
          options={districtOptions}
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
            {props.defaultValues?.id
              ? "Update sub-district"
              : "Add sub-district"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
