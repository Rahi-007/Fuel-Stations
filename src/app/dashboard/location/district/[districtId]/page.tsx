"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import DistrictForm from "../DistrictForm";
import { getDistrictById } from "@/service/district.service";
import useAsyncAction from "@/hooks/useAsyncAction";

export default function EditDistrictPage() {
  const params = useParams();
  const districtId = Number(params.districtId);
  const getDistrict = useAsyncAction(getDistrictById);

  useEffect(() => {
    getDistrict.action(districtId);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit district
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update district or move it to another division.
          </p>

          {getDistrict.data ? (
            <DistrictForm defaultValues={getDistrict.data} />
          ) : null}
        </div>
      </div>
    </AdminGuard>
  );
}
