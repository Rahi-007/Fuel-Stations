"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getUserById } from "@/service/user.service";
import useAsyncAction from "@/hooks/useAsyncAction";

const page = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const fnLoadUser = useAsyncAction(getUserById);
  useEffect(() => {
    if (!userId) return;
    fnLoadUser.action(userId);
  }, [userId]);

  console.log(fnLoadUser.data);

  return (
    <>
      <div className="font-salsa text-center text-3xl pt-4">User profile</div>
      <p className="text-center text-gray-500">
        Check to the console for the all data
      </p>
    </>
  );
};

export default page;
