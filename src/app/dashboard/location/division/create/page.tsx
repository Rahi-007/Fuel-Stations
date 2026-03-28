"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import DivisionForm from "../DivisionForm";

export default function CreateDivisionPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
            Create division
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new division record. Name must be unique.
          </p>

          <div className="mt-8">
            <DivisionForm />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
