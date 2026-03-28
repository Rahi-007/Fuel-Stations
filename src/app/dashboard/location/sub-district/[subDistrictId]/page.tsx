"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import SubDistrictForm from "../SubDistrictForm";
import { getSubDistrictById } from "@/service/sub-district.service";
import useAsyncAction from "@/hooks/useAsyncAction";

export default function EditSubDistrictPage() {
  const params = useParams();
  const subDistrictId = Number(params.subDistrictId);
  const getSubDistrict = useAsyncAction(getSubDistrictById);

  useEffect(() => {
    getSubDistrict.action(subDistrictId);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit sub-district
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update name, description, active flag, or parent district.
          </p>

          {getSubDistrict.data ? (
            <SubDistrictForm defaultValues={getSubDistrict.data} />
          ) : null}
        </div>
      </div>
    </AdminGuard>
  );
}
