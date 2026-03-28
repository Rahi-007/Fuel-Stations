"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { axiosMessage } from "@/lib/axios-error";
import { Button } from "@/components/ui/button";
import type { IDistrict } from "@/interface/district.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteDistrict, loadDistricts } from "@/service/district.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useAsyncAction from "@/hooks/useAsyncAction";
import Link from "next/link";

export default function DistrictsListPage() {
  const fnLoadDistricts = useAsyncAction(loadDistricts);
  const fnDeleteDistrict = useAsyncAction(deleteDistrict);

  useEffect(() => {
    fnLoadDistricts.action();
  }, []);

  const rows: IDistrict[] = fnLoadDistricts.data || [];
  const loading = fnLoadDistricts.onLoading;

  async function handleDelete(id: number, name: string) {
    if (
      !window.confirm(
        `Delete district “${name}”? Fails if sub-districts or stations reference it.`
      )
    ) {
      return;
    }

    try {
      await fnDeleteDistrict.action(id);
      await fnLoadDistricts.action();
      toast.success("District deleted successfully");
    } catch (error) {
      toast.error(axiosMessage(error) || "Something went wrong");
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
                Districts
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                জেলা — each row belongs to one division.
              </p>
            </div>

            <Button asChild>
              <Link href="/dashboard/location/district/create">
                <Plus className="mr-2 h-4 w-4" />
                New district
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5}>Loading…</TableCell>
                  </TableRow>
                )}

                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>No districts yet.</TableCell>
                  </TableRow>
                )}

                {!loading &&
                  rows.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.division?.name ?? "—"}</TableCell>
                      <TableCell className="max-w-50 truncate text-muted-foreground">
                        {d.description || "—"}
                      </TableCell>
                      <TableCell>{d.isActive ? "Yes" : "No"}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/location/district/${d.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDelete(d.id, d.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
