"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { OsmFuelStation } from "@/interface/station.interface";
import "leaflet/dist/leaflet.css";

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 12), { animate: true });
  }, [lat, lng, map]);
  return null;
}

interface StationMapProps {
  centerLat: number;
  centerLng: number;
  stations: OsmFuelStation[];
}

export default function StationMap({
  centerLat,
  centerLng,
  stations,
}: StationMapProps) {
  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={13}
      className="z-0 h-[min(70vh,560px)] w-full rounded-xl border border-border"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter lat={centerLat} lng={centerLng} />
      {stations.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={8}
          pathOptions={{
            color: "#1d4ed8",
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <div className="text-sm font-medium">
                {s.name ?? s.brand ?? "Fuel station"}
              </div>
              {s.brand && s.name ? (
                <div className="text-xs text-neutral-500">{s.brand}</div>
              ) : null}
              {(s.district || s.subDistrict || s.village || s.division) && (
                <div className="mt-1 space-y-0.5 text-[10px] text-neutral-500">
                  {s.division ? <div>Division: {s.division}</div> : null}
                  {s.district ? <div>District: {s.district}</div> : null}
                  {s.subDistrict ? (
                    <div>Sub-district: {s.subDistrict}</div>
                  ) : null}
                  {s.village ? <div>Area: {s.village}</div> : null}
                </div>
              )}
              <div className="mt-1 text-[10px] text-neutral-400">
                DB #{s.id} · OSM {s.osmType}/{s.osmId}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
