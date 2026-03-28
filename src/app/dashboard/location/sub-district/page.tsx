"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ISubDistrict } from "@/interface/sub-district.interface";
import { axiosMessage } from "@/lib/axios-error";
import {
  deleteSubDistrict,
  loadSubDistricts,
} from "@/service/sub-district.service";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useAsyncAction from "@/hooks/useAsyncAction";
import { toast } from "sonner";

export default function SubDistrictsListPage() {
  const fnLoadSubDistricts = useAsyncAction(loadSubDistricts);
  const fnDeleteSubDistrict = useAsyncAction(deleteSubDistrict);

  useEffect(() => {
    fnLoadSubDistricts.action();
  }, []);

  const rows: ISubDistrict[] = fnLoadSubDistricts.data || [];
  const loading = fnLoadSubDistricts.onLoading;

  async function handleDelete(id: number, name: string) {
    if (
      !window.confirm(
        `Delete sub-district “${name}”? Fails if stations reference it.`
      )
    ) {
      return;
    }

    try {
      await fnDeleteSubDistrict.action(id);
      await fnLoadSubDistricts.action();
      toast.success("Sub-district deleted successfully");
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
                Sub-districts
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Upazila / থানা — each row belongs to one district.
              </p>
            </div>

            <Button asChild>
              <Link href="/dashboard/location/sub-district/create">
                <Plus className="mr-2 h-4 w-4" />
                New sub-district
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
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
                    <TableCell colSpan={5}>No sub-districts yet.</TableCell>
                  </TableRow>
                )}

                {!loading &&
                  rows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.district?.name ?? "—"}</TableCell>
                      <TableCell>{s.division?.name ?? "—"}</TableCell>
                      <TableCell>{s.isActive ? "Yes" : "No"}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/dashboard/location/sub-district/${s.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDelete(s.id, s.name)}
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
