"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import GAmount from "@/components/common/GAmount";
import { axiosMessage } from "@/lib/axios-error";
import type { IStation } from "@/interface/station.interface";
import { fetchNearbyStations } from "@/service/stations.service";
import FuelMapLogo from "@/components/layout/FuelMapLogo";
import useAsyncAction from "@/hooks/useAsyncAction";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setLastLocation } from "@/context/slice/location.slice";

const StationMap = dynamic(() => import("@/components/feature/StationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[min(70vh,560px)] w-full animate-pulse rounded-xl border border-border bg-muted" />
  ),
});

const RAJSHAHI = { lat: 24.3745, lng: 88.6042 };

export default function MapPage() {
  const dispatch = useAppDispatch();
  const lastLocation = useAppSelector((state) => state.location.lastLocation);
  const startCenter = lastLocation ?? RAJSHAHI;

  const [center, setCenter] = useState(startCenter);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stations, setStations] = useState<IStation[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<{ radius: number }>({
    defaultValues: {
      radius: 10,
    },
  });

  // Always take the latest radius from the form; fallback to default.
  const watchedRadius = form.watch("radius");
  const radiusKmRaw = Number(watchedRadius);
  // Backend validation (meters) is 100..25000, so in km it's 0.1..25.
  const radiusKm = Number.isFinite(radiusKmRaw) ? radiusKmRaw : 10;
  const radiusKmClamped = Math.max(0.1, Math.min(25, radiusKm));

  // Same pattern as `stations/page.tsx` uses: action() + onLoading + data
  const fnLoadNearby = useAsyncAction(
    async (lat: number, lng: number, radiusKmArg: number) => {
      const radiusInMeters = radiusKmArg * 1000; // Convert km to meters
      return fetchNearbyStations(lat, lng, radiusInMeters);
    }
  );

  const loading = fnLoadNearby.onLoading;

  const loadAndRenderNearby = async (lat: number, lng: number, radiusKmArg: number) => {
    setError(null);
    setMessage(null);
    try {
      const res = await fnLoadNearby.action(lat, lng, radiusKmArg);
      setStations(res.stations);
      setCenter({ lat, lng });
      setMessage(
        `${res.count} fuel station${res.count === 1 ? "" : "s"} found within ${radiusKmArg}km — OpenStreetMap data${
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
      // `useAsyncAction` handles `onLoading`, so no need to set it here.
    }
  };

  const handleSubmit = () => {
    void loadAndRenderNearby(center.lat, center.lng, radiusKmClamped);
  };

  useEffect(() => {
    void loadAndRenderNearby(startCenter.lat, startCenter.lng, radiusKmClamped);
    // Keep initial load only (same behavior as before).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
        dispatch(setLastLocation(location));
        void loadAndRenderNearby(
          pos.coords.latitude,
          pos.coords.longitude,
          radiusKmClamped
        );
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
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <GAmount.Form
                    control={form.control}
                    name="radius"
                    label="Search radius (km)"
                    min={1}
                    max={100}
                    disabled={loading}
                  />
                </form>
              </Form>
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={loading}
              onClick={handleSubmit}
            >
              <MapPin className="mr-1.5 h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => void loadAndRenderNearby(center.lat, center.lng, radiusKmClamped)}
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
              <FuelMapLogo className="mr-1.5 h-4 w-4" />
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
            userLocation={userLocation || undefined}
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
