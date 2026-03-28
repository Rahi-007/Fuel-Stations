"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getDivisionById } from "@/service/division.service";
import { AdminGuard } from "@/components/auth/AdminGuard";
import useAsyncAction from "@/hooks/useAsyncAction";
import DivisionForm from "../DivisionForm";

export default function EditDivisionPage() {
  const params = useParams();
  const divisionId = Number(params.divisionId);
  const getDivision = useAsyncAction(getDivisionById);

  useEffect(() => {
    getDivision.action(divisionId);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit division
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update name, description, or active status.
          </p>

          {getDivision.data ? (
            <DivisionForm defaultValues={getDivision.data} />
          ) : null}
        </div>
      </div>
    </AdminGuard>
  );
}
