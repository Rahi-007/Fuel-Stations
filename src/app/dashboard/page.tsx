"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function DashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin tools for FuelMap.bd
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Locations
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Divisions → districts → sub-districts for station matching.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/location/division">Divisions</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/location/district">Districts</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/location/sub-district">
                    Sub-districts
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
