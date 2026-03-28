"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { axiosMessage } from "@/lib/axios-error";
import type { OsmFuelStation } from "@/interface/station.interface";
import { fetchNearbyStations } from "@/service/stations.service";

const StationMap = dynamic(() => import("@/components/map/StationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[min(70vh,560px)] w-full animate-pulse rounded-xl border border-border bg-muted" />
  ),
});

const DHAKA = { lat: 23.8103, lng: 90.4125 };

export default function MapPage() {
  const [center, setCenter] = useState(DHAKA);
  const [stations, setStations] = useState<OsmFuelStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNearby = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetchNearbyStations(lat, lng, 5000);
      setStations(res.stations);
      setCenter({ lat, lng });
      setMessage(
        `${res.count} fuel station${res.count === 1 ? "" : "s"} — OpenStreetMap data${
          res.persisted ? ", saved to database" : ""
        }`
      );
    } catch (e: unknown) {
      const msg =
        axiosMessage(e) ??
        "Could not load stations. Is the backend running and CORS set?";
      setError(msg);
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNearby(DHAKA.lat, DHAKA.lng);
  }, [loadNearby]);

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void loadNearby(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError(
          "Location permission denied. Showing the Dhaka area — use the map or try again."
        );
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
              Gas stations map
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Nearby pumps from{" "}
              <span className="font-medium text-foreground">OpenStreetMap</span>
              . Uses your location or the map center — data from Overpass via
              your backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => void loadNearby(center.lat, center.lng)}
            >
              <MapPin className="mr-1.5 h-4 w-4" />
              Refresh area
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={loading}
              onClick={onUseLocation}
            >
              <Navigation className="mr-1.5 h-4 w-4" />
              My location
            </Button>
          </div>
        </div>

        {message ? (
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        ) : null}

        <div className="mt-6">
          <StationMap
            centerLat={center.lat}
            centerLng={center.lng}
            stations={stations}
          />
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Map tiles © OpenStreetMap contributors · Station data via Overpass API
          · Backend proxies requests to respect usage limits
        </p>
      </div>
    </div>
  );
}
