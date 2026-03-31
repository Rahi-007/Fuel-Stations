"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import LoginForm from "./LoginForm";
import { fadeUpAnimation, fadeRightAnimation } from "@/lib/motion.utils";
import FuelMapLogo from "@/components/layout/FuelMapLogo";

const Page = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Image
        src="/img/loginIMG.jpg"
        alt=""
        fill
        className="object-cover brightness-[1.04]"
        priority
        sizes="100vw"
      />

      <div className="absolute inset-0 hidden bg-gradient-to-br from-zinc-950/78 via-zinc-950/62 to-cyan-950/28 dark:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-black/42 via-transparent to-black/18 dark:block" />
      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(34,211,238,0.075),transparent)] dark:block" />
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <motion.div
          className="mb-10 flex flex-1 flex-col justify-center lg:mb-0"
          {...fadeRightAnimation(28, 0.55, 0)}
        >
          <Link
            href="/"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-cyan-700 dark:text-zinc-400 dark:hover:text-cyan-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-300/70 bg-white/70 text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-cyan-400">
              <FuelMapLogo className="h-[22px] w-[22px]" />
            </span>
            FuelMap.bd
          </Link>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl"
            {...fadeUpAnimation(20, 0.5, 0.08)}
          >
            Fuel up smarter,
            <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              wherever you drive.
            </span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
            {...fadeUpAnimation(16, 0.45, 0.14)}
          >
            Sign in to find stations, check availability, and plan trips across
            Bangladesh.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            {...fadeUpAnimation(12, 0.4, 0.22)}
          >
            {["Live map", "Stock info", "Fast search"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-zinc-300/70 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
