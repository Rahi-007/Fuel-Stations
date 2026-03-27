"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/service/auth.service";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setAuth } from "@/context/slice/auth.slice";
import LoginForm from "./LoginForm";

const page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to FuelMap.
          </p>
        </div>

        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="rounded-lg border bg-card p-4">
          <LoginForm
            onSubmit={async (values) => {
              setError(null);
              try {
                const res = await login(values);
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                localStorage.setItem("user", JSON.stringify(res.user));
                dispatch(setAuth(res));
                router.replace("/");
              } catch (e: any) {
                setError(e || "Login failed");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
