import GSelect from "@/components/common/GSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useAsyncAction from "@/hooks/useAsyncAction";
import { IStation, OsmType } from "@/interface/station.interface";
import { urlWithState } from "@/lib/global.utils";
import { loadDistricts } from "@/service/district.service";
import { loadDivisions } from "@/service/division.service";
import { editStation } from "@/service/stations.service";
import { loadSubDistricts } from "@/service/sub-district.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const updateStationSchema = z.object({
  osmRef: z.enum(OsmType).optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  divisionId: z.number().optional(),
  districtId: z.number().optional(),
  subDistrictId: z.number().optional(),
  village: z.string().optional(),
  tags: z.number().optional(),
});

interface IProps {
  defaultValues?: IStation;
}

export type StationFormValues = z.infer<typeof updateStationSchema>;

const StationForm = (props: IProps) => {
  const router = useRouter();
  const fnEditStation = useAsyncAction(editStation);
  const fnLoadDivisions = useAsyncAction(loadDivisions);
  const fnLoadDistricts = useAsyncAction(loadDistricts);
  const fnLoadSubDistricts = useAsyncAction(loadSubDistricts);

  const form = useForm<StationFormValues>({
    resolver: zodResolver(updateStationSchema),
    defaultValues: {
      name: props.defaultValues?.name || "",
      //   osmType: props.defaultValues?.osmType || OsmType.Node,
      brand: props.defaultValues?.brand || "",
      lat: props.defaultValues?.lat || 0,
      lng: props.defaultValues?.lng || 0,
      //   tags: props.defaultValues?.tags || 0,
      divisionId: props.defaultValues?.division?.id || 0,
      districtId: props.defaultValues?.district.id || 0,
      subDistrictId: props.defaultValues?.subDistrict.id || 0,
      village: props.defaultValues?.village || "",
    },
  });

  const divisionOptions = useMemo(() => {
    const list = fnLoadDivisions.data ?? [];

    return [...list]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => ({
        label: d.name,
        value: String(d.id),
      }));
  }, [fnLoadDivisions.data]);

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

  const subDistrictOptions = useMemo(() => {
    const list = fnLoadSubDistricts.data ?? [];

    return [...list]
      .sort((a, b) => {
        const da = a.district?.name ?? "";
        const db = b.district?.name ?? "";
        if (da !== db) return da.localeCompare(db);
        return a.name.localeCompare(b.name);
      })
      .map((s) => ({
        label: s.district?.name ? `${s.district.name} — ${s.name}` : s.name,
        value: String(s.id),
      }));
  }, [fnLoadSubDistricts.data]);

  useEffect(() => {
    fnLoadDivisions.action();
    fnLoadDistricts.action();
    fnLoadSubDistricts.action();
  }, []);

  function onSubmit(values: StationFormValues) {
    if (props.defaultValues) {
      fnEditStation
        .action(props.defaultValues.id, values)
        .then(() => {
          toast.success("Station updated successfully");
          router.push(urlWithState(`/Station`));
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
        <GSelect.Form
          control={form.control}
          name="divisionId"
          label="Division"
          placeholder="Select Division"
          valueAsNumber
          loading={fnLoadDivisions.onLoading}
          loadingPlaceholder="Loading division..."
          options={divisionOptions}
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
        <GSelect.Form
          control={form.control}
          name="subDistrictId"
          label="Sub District"
          placeholder="Select Sub-District"
          valueAsNumber
          loading={fnLoadSubDistricts.onLoading}
          loadingPlaceholder="Loading sub-Districts..."
          options={subDistrictOptions}
        />

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Updating..." : "Update Station"}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StationForm;
