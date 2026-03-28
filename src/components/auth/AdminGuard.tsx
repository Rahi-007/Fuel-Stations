"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHooks";

export const ADMIN_ROLE = "admin";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Restricts children to logged-in users with role === admin.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== ADMIN_ROLE) {
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user || user.role !== ADMIN_ROLE) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
