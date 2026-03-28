"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHooks";

/** Paths that do not require a session (home + auth screens). */
const PUBLIC_PATHS = new Set(["/", "/login", "/register", "/stations", "/map"]);

function hasStoredAccessToken() {
  try {
    return Boolean(localStorage.getItem("accessToken"));
  } catch {
    return false;
  }
}

export function AuthRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (PUBLIC_PATHS.has(pathname)) return;

    const authed = Boolean(user || hasStoredAccessToken());
    if (!authed) {
      router.replace("/login");
    }
  }, [mounted, pathname, user, router]);

  return null;
}
