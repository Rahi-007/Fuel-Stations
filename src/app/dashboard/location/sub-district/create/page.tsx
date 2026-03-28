"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import SubDistrictForm from "../SubDistrictForm";

export default function CreateSubDistrictPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Create sub-district
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add an upazila / sub-district under a district. Name must be unique
            within that district.
          </p>

          <div className="mt-8">
            <SubDistrictForm />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
