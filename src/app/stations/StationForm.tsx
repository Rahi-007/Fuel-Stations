import useAsyncAction from "@/hooks/useAsyncAction";
import { DivisionSelect, DistrictSelect, SubDistrictSelect } from "@/components/common/LocationSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IStation, OsmType } from "@/interface/station.interface";
import { editStation } from "@/service/stations.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import GInput from "@/components/common/GInput";

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
  // tags: z.number().optional(),
});

interface IProps {
  defaultValues?: IStation;
}

export type StationFormValues = z.infer<typeof updateStationSchema>;

const StationForm = (props: IProps) => {
  const router = useRouter();
  const fnEditStation = useAsyncAction(editStation);

  const form = useForm<StationFormValues>({
    resolver: zodResolver(updateStationSchema),
    defaultValues: {
      name: props.defaultValues?.name || "",
      brand: props.defaultValues?.brand || "",
      lat: props.defaultValues?.lat || 0,
      lng: props.defaultValues?.lng || 0,
      divisionId: props.defaultValues?.division?.id || undefined,
      districtId: props.defaultValues?.district?.id || undefined,
      subDistrictId: props.defaultValues?.subDistrict?.id || undefined,
      village: props.defaultValues?.village || "",
      // tags: props.defaultValues?.tags ? Number(props.defaultValues.tags) : undefined,
    },
  });

  // Watch values for location selector
  const divisionId = form.watch("divisionId");
  const districtId = form.watch("districtId");

  async function onSubmit(values: StationFormValues) {
    try {
      if (props.defaultValues) {
        await fnEditStation.action(props.defaultValues.id, values);

        toast.success("Station updated successfully");
        router.push(`/stations`);
      }
    } catch (error) {
      toast.error(String(error));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <DivisionSelect
          control={form.control}
          name="divisionId"
          required
        />

        <DistrictSelect
          control={form.control}
          name="districtId"
          divisionId={divisionId}
          required
        />

        <SubDistrictSelect
          control={form.control}
          name="subDistrictId"
          districtId={districtId}
          required
        />

        <GInput.Form
          control={form.control}
          name="village"
          label="Village"
          required
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
