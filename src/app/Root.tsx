"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setAuth } from "@/context/slice/auth.slice";
import { IUser } from "@/interface/user.interface";
import { setAxiosAuthToken } from "@/service/auth.service";
import { AuthRouteGuard } from "@/components/auth/AuthRouteGuard";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export default function Root({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userString = localStorage.getItem(USER_KEY);

    setAxiosAuthToken(accessToken);

    // only if all exist → set auth
    if (accessToken && refreshToken && userString) {
      try {
        const user = JSON.parse(userString) as IUser;
        dispatch(setAuth({ accessToken, refreshToken, user }));
      } catch {
        // ignore error (no force clear)
      }
    }
  }, [dispatch]);

  return (
    <>
      <AuthRouteGuard />
      {children}
    </>
  );
}
