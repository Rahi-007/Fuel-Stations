import useAsyncAction from "@/hooks/useAsyncAction";
import {
  DivisionSelect,
  DistrictSelect,
  SubDistrictSelect,
} from "@/components/common/LocationSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FuelStatus,
  IStation,
  QueueStatus,
} from "@/interface/station.interface";
import { editStation } from "@/service/stations.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import GInput from "@/components/common/GInput";
import GSelect from "@/components/common/GSelect";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export const updateStationSchema = z.object({
  name: z.string().optional(),
  brand: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  divisionId: z.coerce.number().optional(),
  districtId: z.coerce.number().optional(),
  subDistrictId: z.coerce.number().optional(),
  village: z.string().optional(),

  avatar: z.string().optional(),
  openingTime: z.string().optional(),
  googleMapLink: z.string().optional(),

  status: z.nativeEnum(FuelStatus).optional(),
  queueStatus: z.nativeEnum(QueueStatus).optional(),

  fuelTypes: z
    .object({
      petrol: z.boolean(),
      octane: z.boolean(),
      diesel: z.boolean(),
    })
    .optional(),

  prices: z
    .object({
      petrol: z.coerce.number(),
      octane: z.coerce.number(),
      diesel: z.coerce.number(),
    })
    .optional(),

  description: z.string().optional(),
  adminNote: z.string().optional(),
});

interface IProps {
  defaultValues?: IStation;
}

export type StationFormValues = z.infer<typeof updateStationSchema>;

const StationForm = (props: IProps) => {
  const router = useRouter();
  const fnEditStation = useAsyncAction(editStation);

  const form = useForm<StationFormValues>({
    resolver: zodResolver(updateStationSchema) as any,
    defaultValues: {
      name: props.defaultValues?.name || "",
      brand: props.defaultValues?.brand || "",
      lat: props.defaultValues?.lat || 0,
      lng: props.defaultValues?.lng || 0,
      divisionId: props.defaultValues?.division?.id || undefined,
      districtId: props.defaultValues?.district?.id || undefined,
      subDistrictId: props.defaultValues?.subDistrict?.id || undefined,
      village: props.defaultValues?.village || "",

      avatar: props.defaultValues?.avatar || "",
      openingTime: props.defaultValues?.openingTime || "",
      googleMapLink: props.defaultValues?.googleMapLink || "",

      status: props.defaultValues?.status,
      queueStatus: props.defaultValues?.queueStatus,

      fuelTypes: {
        petrol: props.defaultValues?.fuelTypes?.petrol ?? false,
        octane: props.defaultValues?.fuelTypes?.octane ?? false,
        diesel: props.defaultValues?.fuelTypes?.diesel ?? false,
      },
      prices: {
        petrol: props.defaultValues?.prices?.petrol ?? 0,
        octane: props.defaultValues?.prices?.octane ?? 0,
        diesel: props.defaultValues?.prices?.diesel ?? 0,
      },
      description: props.defaultValues?.description || "",
      adminNote: props.defaultValues?.adminNote || "",
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
        <GInput.Form control={form.control} name="name" label="Station name" />
        <GInput.Form control={form.control} name="brand" label="Brand" />

        <div className="grid gap-3 sm:grid-cols-2">
          <GInput.Form
            control={form.control}
            name="lat"
            label="Latitude"
            type="number"
            step="any"
          />
          <GInput.Form
            control={form.control}
            name="lng"
            label="Longitude"
            type="number"
            step="any"
          />
        </div>

        <DivisionSelect control={form.control} name="divisionId" />

        <DistrictSelect
          control={form.control}
          name="districtId"
          divisionId={divisionId}
        />

        <SubDistrictSelect
          control={form.control}
          name="subDistrictId"
          districtId={districtId}
        />

        <GInput.Form control={form.control} name="village" label="Village" />

        <GInput.Form
          control={form.control}
          name="avatar"
          label="Avatar URL"
          placeholder="https://..."
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <GSelect.Form
            control={form.control}
            name="status"
            label="Fuel status"
            placeholder="Select status"
            options={[
              { label: "Available", value: FuelStatus.AVAILABLE },
              { label: "Limited", value: FuelStatus.LIMITED },
              { label: "Out of stock", value: FuelStatus.OUT_OF_STOCK },
            ]}
          />
          <GSelect.Form
            control={form.control}
            name="queueStatus"
            label="Queue status"
            placeholder="Select queue status"
            options={[
              { label: "Low", value: QueueStatus.LOW },
              { label: "Medium", value: QueueStatus.MEDIUM },
              { label: "High", value: QueueStatus.HIGH },
            ]}
          />
        </div>

        <GInput.Form
          control={form.control}
          name="openingTime"
          label="Opening time"
          placeholder="08:00"
        />

        <GInput.Form
          control={form.control}
          name="googleMapLink"
          label="Google Map link"
          placeholder="https://maps.google.com/?q=..."
        />

        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">Fuel types</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(["petrol", "octane", "diesel"] as const).map((k) => (
              <FormField
                key={k}
                control={form.control}
                name={`fuelTypes.${k}`}
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <Checkbox
                      checked={Boolean(field.value)}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                    <FormLabel className="capitalize">{k}</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">Fuel prices</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <GInput.Form
              control={form.control}
              name="prices.petrol"
              label="Petrol"
              type="number"
              step="any"
            />
            <GInput.Form
              control={form.control}
              name="prices.octane"
              label="Octane"
              type="number"
              step="any"
            />
            <GInput.Form
              control={form.control}
              name="prices.diesel"
              label="Diesel"
              type="number"
              step="any"
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea {...field} value={field.value ?? ""} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adminNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin note</FormLabel>
              <Textarea {...field} value={field.value ?? ""} />
              <FormMessage />
            </FormItem>
          )}
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
