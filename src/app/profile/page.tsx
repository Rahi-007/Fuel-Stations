"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getUserById } from "@/service/user.service";
import useAsyncAction from "@/hooks/useAsyncAction";
import Header from "@/components/layout/Header";
import ProfilePage from "@/components/layout/ProfilePage";

const page = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const fnLoadUser = useAsyncAction(getUserById);
  useEffect(() => {
    if (!userId) return;
    fnLoadUser.action(userId);
  }, [userId]);

  return (
    <>
      {fnLoadUser.data?.email ? (
        <>
          {/* Navbar */}
          <Header />
          <ProfilePage user={fnLoadUser.data} />
        </>
      ) : (
        <>
          <h1 className="text-center mt-10">Loading...</h1>{" "}
        </>
      )}
    </>
  );
};

export default page;
