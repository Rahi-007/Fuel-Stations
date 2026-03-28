"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import DistrictForm from "../DistrictForm";

export default function CreateDistrictPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Create district
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a district under a division. Name must be unique within that
            division.
          </p>

          <div className="mt-8">
            <DistrictForm />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
