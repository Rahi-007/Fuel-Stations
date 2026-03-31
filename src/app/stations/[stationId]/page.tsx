"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { getStationById } from "@/service/stations.service";
import { AdminGuard } from "@/components/auth/AdminGuard";
import useAsyncAction from "@/hooks/useAsyncAction";
import StationForm from "../StationForm";

export default function EditDivisionPage() {
  const params = useParams();
  const stationId = Number(params.stationId);
  const getStation = useAsyncAction(getStationById);

  useEffect(() => {
    getStation.action(stationId);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit Station
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update name, brand, or others status.
          </p>

          {getStation.data ? (
            <StationForm defaultValues={getStation.data} />
          ) : null}
        </div>
      </div>
    </AdminGuard>
  );
}
