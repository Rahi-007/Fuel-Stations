"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Header from "@/components/layout/Header";
import GSelect from "@/components/common/GSelect";
import useAsyncAction from "@/hooks/useAsyncAction";

import { loadStations } from "@/service/stations.service";
import { loadDistricts } from "@/service/district.service";
import { loadSubDistricts } from "@/service/sub-district.service";
import { loadDivisions } from "@/service/division.service";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const DB_LIMIT = 500;

type FilterForm = {
  divisionId?: number;
  districtId?: number;
  subDistrictId?: number;
};

export default function StationsPage() {
  // async hooks
  const fnLoadStations = useAsyncAction(loadStations);
  const fnLoadDivisions = useAsyncAction(loadDivisions);
  const fnLoadDistricts = useAsyncAction(loadDistricts);
  const fnLoadSubDistricts = useAsyncAction(loadSubDistricts);

  // form
  const form = useForm<FilterForm>({
    defaultValues: {
      divisionId: undefined,
      districtId: undefined,
      subDistrictId: undefined,
    },
  });

  // options
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

  // submit handler
  const onSubmit = (values: FilterForm) => {
    fnLoadStations.action({
      division: values.divisionId?.toString(),
      district: values.districtId?.toString(),
      subDistrict: values.subDistrictId?.toString(),
      limit: DB_LIMIT,
    });
  };

  // initial load
  useEffect(() => {
    fnLoadStations.action({ limit: DB_LIMIT }); // all
    fnLoadDivisions.action();
    fnLoadDistricts.action();
    fnLoadSubDistricts.action();
  }, []);

  const loading = fnLoadStations.onLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* header */}
        <div>
          <h1 className="font-salsa text-2xl font-semibold sm:text-3xl">
            All stations
          </h1>
        </div>

        {/* filters */}
        <div className="mt-6 rounded-xl border p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <GSelect.Form
                  control={form.control}
                  name="divisionId"
                  label="Division"
                  placeholder="Select Division"
                  valueAsNumber
                  options={divisionOptions}
                  loading={fnLoadDivisions.onLoading}
                />

                <GSelect.Form
                  control={form.control}
                  name="districtId"
                  label="District"
                  placeholder="Select District"
                  valueAsNumber
                  options={districtOptions}
                  loading={fnLoadDistricts.onLoading}
                />

                <GSelect.Form
                  control={form.control}
                  name="subDistrictId"
                  label="Sub-District"
                  placeholder="Select Sub-district"
                  valueAsNumber
                  options={subDistrictOptions}
                  loading={fnLoadSubDistricts.onLoading}
                />
              </div>

              <Button type="submit" className="mt-4">
                Apply filters
              </Button>
            </form>
          </Form>
        </div>

        {/* table */}
        <div className="mt-6 rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Sub-district</TableHead>
                <TableHead>Village</TableHead>
                <TableHead className="text-right">Lat</TableHead>
                <TableHead className="text-right">Lng</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8}>Loading...</TableCell>
                </TableRow>
              )}

              {!loading &&
                fnLoadStations.data?.data?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name ?? "—"}</TableCell>
                    <TableCell>{s.brand ?? "—"}</TableCell>

                    {/* ⚠️ relation object হলে name use কর */}
                    <TableCell>{s.division?.name ?? "—"}</TableCell>
                    <TableCell>{s.district?.name ?? "—"}</TableCell>
                    <TableCell>{s.subDistrict?.name ?? "—"}</TableCell>

                    <TableCell>{s.village ?? "—"}</TableCell>

                    <TableCell className="text-right">
                      {s.lat?.toFixed(5) ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.lng?.toFixed(5) ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/location/division/${s.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={true}
                          // onClick={() => void handleDelete(d.id, d.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* ✅ Empty State */}
              {!loading && fnLoadStations.data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
