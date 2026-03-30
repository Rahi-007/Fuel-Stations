"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getUserById } from "@/service/user.service";
import useAsyncAction from "@/hooks/useAsyncAction";
import Header from "@/components/layout/Header";
import ProfilePage from "@/app/profile/ProfilePage";
import Loading from "../loading";
import Footer from "@/components/layout/Footer";

const page = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const fnLoadUser = useAsyncAction(getUserById);
  useEffect(() => {
    if (!userId) return;
    fnLoadUser.action(userId);
  }, [userId]);
  // console.log({fnLoadUser})

  return (
    <>
      {fnLoadUser.data?.email ? (
        <>
          {/* Navbar */}
          <Header />
          <ProfilePage user={fnLoadUser.data} />
          <Footer />
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </>
  );
};

export default page;
