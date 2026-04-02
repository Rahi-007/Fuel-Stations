"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNearbyStations } from "@/service/stations.service";
import {
  FuelStatus,
  type NearbyStation,
  type NearbyStationsResponse,
} from "@/interface/station.interface";
import { axiosMessage } from "@/lib/axios-error";
import { fadeUpAnimation } from "@/lib/motion.utils";
import Link from "next/link";

export default function NearbyStationsSection() {
  const [nearbyStations, setNearbyStations] = useState<NearbyStation[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  const [nearbyInfo, setNearbyInfo] = useState<string | null>(null);
  const [nearbySource, setNearbySource] = useState<
    NearbyStationsResponse["source"] | null
  >(null);

  const handleUseLocationPreview = () => {
    if (!navigator.geolocation) {
      setNearbyError("Geolocation is not supported in this browser.");
      return;
    }

    setNearbyLoading(true);
    setNearbyError(null);
    setNearbyInfo(null);
    setNearbySource(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const radiusKm = 8;
          const res = await fetchNearbyStations(
            pos.coords.latitude,
            pos.coords.longitude,
            radiusKm * 1000
          );
          setNearbyStations(res.stations.slice(0, 9));
          setNearbySource(res.source);
          setNearbyInfo(
            `${res.count} station${res.count === 1 ? "" : "s"} found within ${radiusKm}km`
          );
        } catch (e: unknown) {
          setNearbyError(
            axiosMessage(e) ?? "Could not load nearby stations right now."
          );
          setNearbyStations([]);
          setNearbySource(null);
        } finally {
          setNearbyLoading(false);
        }
      },
      () => {
        setNearbyLoading(false);
        setNearbyError(
          "Location permission denied. Please allow location access."
        );
        setNearbySource(null);
      }
    );
  };

  const sourceLabel =
    nearbySource === "database"
      ? "Source: Database"
      : nearbySource === "openstreetmap"
        ? "Source: OpenStreetMap"
        : nearbySource === "database+openstreetmap"
          ? "Source: Database + OpenStreetMap"
          : null;

  return (
    <motion.section
      className="rounded-2xl border bg-card/85 p-5 backdrop-blur sm:p-6"
      {...fadeUpAnimation(14, 0.4, 0.08)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Nearby stations from your location
          </h3>
          <p className="text-sm text-muted-foreground">
            Tap to preview stations before opening map
          </p>
        </div>
        <Button onClick={handleUseLocationPreview} disabled={nearbyLoading}>
          <MapPin className="mr-2 h-4 w-4" />
          {nearbyLoading ? "Finding..." : "Use my location"}
        </Button>
      </div>

      {/* {nearbyInfo ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">{nearbyInfo}</p>
          {sourceLabel ? (
            <span className="rounded-full border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {sourceLabel}
            </span>
          ) : null}
        </div>
      ) : null} */}
      {/* {nearbyError ? (
        <p className="mt-4 text-sm text-destructive">{nearbyError}</p>
      ) : null} */}

      {nearbyStations.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {nearbyStations.map((s) => (
            <Link
              key={s.id}
              href={`/stations/${s.id}`}
              className="rounded-lg border bg-background/70 p-3 transition hover:bg-background/90 hover:shadow-sm"
            >
              <p className="text-sm font-medium text-foreground">
                {s.name ?? s.brand ?? "Fuel station"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {[s.village, s.subDistrict, s.district, s.division].filter(
                  Boolean
                ).length
                  ? `Location: ${[
                      s.village,
                      s.subDistrict,
                      s.district,
                      s.division,
                    ]
                      .filter(Boolean)
                      .join(", ")}`
                  : "Click to view in map"}
              </p>

              <p className="mt-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.status === FuelStatus.AVAILABLE
                      ? "bg-green-100 text-green-700"
                      : s.status === FuelStatus.LIMITED
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.status === FuelStatus.AVAILABLE
                    ? "Available"
                    : s.status === FuelStatus.LIMITED
                      ? "Limited"
                      : "Out of stock"}
                </span>
              </p>
            </Link>
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
