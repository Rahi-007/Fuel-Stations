"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OsmFuelStation } from "@/interface/station.interface";
import { axiosMessage } from "@/lib/axios-error";
import { fetchStationsFromDb } from "@/service/stations.service";

const DB_LIMIT = 500;

export default function StationsPage() {
  const [stations, setStations] = useState<OsmFuelStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fDivision, setFDivision] = useState("");
  const [fDistrict, setFDistrict] = useState("");
  const [fSubDistrict, setFSubDistrict] = useState("");
  const [fVillage, setFVillage] = useState("");

  const loadFromDb = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetchStationsFromDb({
        division: fDivision || undefined,
        district: fDistrict || undefined,
        subDistrict: fSubDistrict || undefined,
        village: fVillage || undefined,
        limit: DB_LIMIT,
      });
      setStations(res.stations);
      setMessage(
        res.count
          ? `Showing ${res.count} station${res.count === 1 ? "" : "s"} (max ${DB_LIMIT} per request).`
          : "No stations match these filters in the database."
      );
    } catch (e: unknown) {
      setError(
        axiosMessage(e) ?? "Could not query the database. Is the backend up?"
      );
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [fDivision, fDistrict, fSubDistrict, fVillage]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res = await fetchStationsFromDb({ limit: DB_LIMIT });
        setStations(res.stations);
        setMessage(
          res.count
            ? `Showing ${res.count} station${res.count === 1 ? "" : "s"} (max ${DB_LIMIT} per request).`
            : "No stations in the database yet."
        );
      } catch (e: unknown) {
        setError(
          axiosMessage(e) ?? "Could not query the database. Is the backend up?"
        );
        setStations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        <div>
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            All stations
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Data from your saved database (synced from OpenStreetMap). Filter by
            division, district (জেলা), sub-district (upazila), or village / area
            — partial match, case-insensitive. Empty fields are ignored.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card/40 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="f-division" className="text-xs">
                Division
              </Label>
              <Input
                id="f-division"
                placeholder="e.g. Dhaka"
                value={fDivision}
                onChange={(e) => setFDivision(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-district" className="text-xs">
                District (জেলা)
              </Label>
              <Input
                id="f-district"
                placeholder="e.g. Dhaka"
                value={fDistrict}
                onChange={(e) => setFDistrict(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-sub-district" className="text-xs">
                Sub-district (upazila)
              </Label>
              <Input
                id="f-sub-district"
                placeholder="e.g. Dhanmondi"
                value={fSubDistrict}
                onChange={(e) => setFSubDistrict(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-village" className="text-xs">
                Village / area
              </Label>
              <Input
                id="f-village"
                placeholder="e.g. Mohakhali"
                value={fVillage}
                onChange={(e) => setFVillage(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            disabled={loading}
            onClick={() => void loadFromDb()}
          >
            Apply filters
          </Button>
        </div>

        {message ? (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        ) : null}

        <div className="mt-6 rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Sub-district</TableHead>
                <TableHead>Village / area</TableHead>
                <TableHead className="text-right">Lat</TableHead>
                <TableHead className="text-right">Lng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : null}
              {!loading && stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground">
                    No rows.
                  </TableCell>
                </TableRow>
              ) : null}
              {stations.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="max-w-[180px] font-medium">
                    {s.name ?? "—"}
                  </TableCell>
                  <TableCell>{s.brand ?? "—"}</TableCell>
                  <TableCell>{s.division ?? "—"}</TableCell>
                  <TableCell>{s.district ?? "—"}</TableCell>
                  <TableCell>{s.subDistrict ?? "—"}</TableCell>
                  <TableCell>{s.village ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.lat.toFixed(5)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {s.lng.toFixed(5)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Station data from OpenStreetMap via your backend · Up to {DB_LIMIT}{" "}
          rows per request
        </p>
      </div>
    </div>
  );
}
