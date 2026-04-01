"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { NearbyStation } from "@/interface/station.interface";
import "leaflet/dist/leaflet.css";
import { MapPin, Fuel } from "lucide-react";

// Custom icon using Lucide React component - Google Maps style red pin
const userLocationIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="
    background-color: #ea4335;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
    border: 3px solid white;
  ">
    <div style="
      background-color: white;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      transform: rotate(45deg);
    "></div>
  </div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Fuel station icon - blue with gas pump icon
const fuelStationIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="
    background-color: #3b82f6;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.5);
    border: 3px solid white;
  ">
    <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
      <path d="M6 2h8v8H6z"/>
      <path d="M6 10v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10"/>
      <path d="M14 6h4a2 2 0 0 1 2 2v4"/>
      <path d="M18 12h2"/>
      <line x1="10" y1="22" x2="10" y2="22"/>
    </svg>
  </div>`,
  iconSize: [35, 35],
  iconAnchor: [17.5, 17.5],
  popupAnchor: [0, -17.5],
});

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
  stations: NearbyStation[];
  userLocation?: { lat: number; lng: number };
}

export default function StationMap({
  centerLat,
  centerLng,
  stations,
  userLocation,
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

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
          title="Your location"
        >
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {stations.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={fuelStationIcon}>
          <Popup>
            <div className="min-w-40">
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
        </Marker>
      ))}
    </MapContainer>
  );
}
