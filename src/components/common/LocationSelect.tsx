"use client";

import { useEffect, useMemo } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import GSelect from "./GSelect";
import useAsyncAction from "@/hooks/useAsyncAction";
import { loadDivisions } from "@/service/division.service";
import { loadDistricts } from "@/service/district.service";
import { loadSubDistricts } from "@/service/sub-district.service";

type Option = {
  label: string;
  value: string;
};

/**
 * Division Select
 */
interface IDivisionSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  onChange?: (divisionId: number | null) => void;
}

export function DivisionSelect<T extends FieldValues>({
  control,
  name,
  disabled = false,
  required = false,
  loading = false,
}: IDivisionSelectProps<T>) {
  const fnLoad = useAsyncAction(loadDivisions);

  // ✅ FIX: always load on mount
  useEffect(() => {
    fnLoad.action();
  }, []);

  const options: Option[] = useMemo(() => {
    return (fnLoad.data || []).map((div) => ({
      label: div.name,
      value: String(div.id),
    }));
  }, [fnLoad.data]);

  return (
    <GSelect.Form
      control={control}
      name={name}
      label="Division"
      placeholder="Select Division"
      valueAsNumber
      disabled={disabled || fnLoad.onLoading}
      required={required}
      loading={loading || fnLoad.onLoading}
      loadingPlaceholder="Loading divisions..."
      options={options}
    />
  );
}

/**
 * District Select (depends on divisionId)
 */
interface IDistrictSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  divisionId?: number;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
}

export function DistrictSelect<T extends FieldValues>({
  control,
  name,
  divisionId,
  disabled = false,
  required = false,
  loading = false,
}: IDistrictSelectProps<T>) {
  const fnLoad = useAsyncAction(loadDistricts);

  // ✅ load only once
  useEffect(() => {
    fnLoad.action();
  }, []);

  const options: Option[] = useMemo(() => {
    if (!divisionId) return [];

    const allDistricts = fnLoad.data || [];

    const filtered = allDistricts.filter(
      (d) => Number(d.division?.id) === Number(divisionId)
    );

    return filtered.map((dist) => ({
      label: dist.name,
      value: String(dist.id),
    }));
  }, [fnLoad.data, divisionId]);

  return (
    <GSelect.Form
      control={control}
      name={name}
      label="District"
      placeholder="Select District"
      valueAsNumber
      disabled={disabled || !divisionId || fnLoad.onLoading}
      required={required}
      loading={loading || fnLoad.onLoading}
      loadingPlaceholder="Loading districts..."
      options={options}
    />
  );
}

/**
 * Sub District Select (depends on districtId)
 */
interface ISubDistrictSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  districtId?: number;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
}

export function SubDistrictSelect<T extends FieldValues>({
  control,
  name,
  districtId,
  disabled = false,
  required = false,
  loading = false,
}: ISubDistrictSelectProps<T>) {
  const fnLoad = useAsyncAction(loadSubDistricts);

  // ✅ load only once
  useEffect(() => {
    fnLoad.action();
  }, []);

  const options: Option[] = useMemo(() => {
    if (!districtId) return [];

    const allSubDistricts = fnLoad.data || [];

    const filtered = allSubDistricts.filter(
      (sd) => Number(sd.district?.id) === Number(districtId)
    );

    return filtered.map((sub) => ({
      label: sub.name,
      value: String(sub.id),
    }));
  }, [fnLoad.data, districtId]);

  return (
    <GSelect.Form
      control={control}
      name={name}
      label="Sub District"
      placeholder="Select Sub-District"
      valueAsNumber
      disabled={disabled || !districtId || fnLoad.onLoading}
      required={required}
      loading={loading || fnLoad.onLoading}
      loadingPlaceholder="Loading sub-districts..."
      options={options}
    />
  );
}
