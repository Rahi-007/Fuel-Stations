"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import GInput from "@/components/common/GInput";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setAuth } from "@/context/slice/auth.slice";
import { register, setAxiosAuthToken } from "@/service/auth.service";
import { fadeUp, fadeUpAnimation, fadeRightAnimation } from "@/lib/motion.utils";

const inputDark =
  "h-11 rounded-xl border border-zinc-300/70 bg-white/80 px-3.5 text-zinc-900 shadow-none placeholder:text-zinc-500/90 backdrop-blur-md transition-[border-color,background-color,box-shadow] focus-visible:border-cyan-500/40 focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(14,116,144,0.10)] focus-visible:ring-0 dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-slate-100 dark:placeholder:text-slate-400/80 dark:focus-visible:border-white/25 dark:focus-visible:bg-white/[0.07] dark:focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.06)]";

const SignUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      const res = await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || undefined,
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      setAxiosAuthToken(res.accessToken);
      dispatch(setAuth(res));
      toast.success("Account created successfully");
      router.replace("/");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <motion.div
      className="w-full max-w-[420px]"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={{ delay: 0.05, y: 24 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 p-8 shadow-[0_24px_64px_-20px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.14] dark:bg-black/25 dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.55)] supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-black/15">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-400/35 to-transparent dark:via-white/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 to-transparent opacity-60 dark:from-white/[0.04] dark:opacity-50" />

        <motion.div
          className="relative space-y-3 text-center"
          {...fadeUpAnimation(14, 0.4, 0.02)}
        >
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-300/70 bg-white/80 backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.06]">
            <UserPlus className="h-5 w-5 text-zinc-700 dark:text-slate-200" />
          </div>
          <h2 className="bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-400">
            Create account
          </h2>
          <p className="text-sm text-zinc-600 dark:text-slate-300/80">
            Join FuelMap.bd and start exploring nearby stations.
          </p>
        </motion.div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative mt-8 space-y-5"
          >
            <motion.div
              {...fadeUpAnimation(12, 0.35, 0.06)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-2">
                <label className="ml-0.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-slate-400/90">
                  <span className="h-1 w-1 rounded-full bg-zinc-500/60 dark:bg-white/40" aria-hidden />
                  First name
                </label>
                <GInput.Form
                  type="text"
                  name="firstName"
                  label=""
                  control={form.control}
                  placeholder="John"
                  className={inputDark}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-0.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-slate-400/90">
                  <span className="h-1 w-1 rounded-full bg-zinc-500/60 dark:bg-white/40" aria-hidden />
                  Last name
                </label>
                <GInput.Form
                  type="text"
                  name="lastName"
                  label=""
                  control={form.control}
                  placeholder="Doe"
                  className={inputDark}
                />
              </div>
            </motion.div>

            <motion.div {...fadeUpAnimation(12, 0.35, 0.14)} className="space-y-2">
              <label className="ml-0.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-slate-400/90">
                <span className="h-1 w-1 rounded-full bg-zinc-500/60 dark:bg-white/40" aria-hidden />
                Email
              </label>
              <GInput.Form
                type="email"
                name="email"
                label=""
                control={form.control}
                placeholder="you@example.com"
                className={inputDark}
              />
            </motion.div>

            <motion.div {...fadeUpAnimation(12, 0.35, 0.18)} className="space-y-2">
              <label className="ml-0.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-slate-400/90">
                <span className="h-1 w-1 rounded-full bg-zinc-500/60 dark:bg-white/40" aria-hidden />
                Password
              </label>
              <div className="relative">
                <GInput.Form
                  type={showPass ? "text" : "password"}
                  name="password"
                  label=""
                  control={form.control}
                  placeholder="••••••••"
                  className={`${inputDark} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div {...fadeUpAnimation(12, 0.35, 0.22)} className="space-y-2">
              <label className="ml-0.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-slate-400/90">
                <span className="h-1 w-1 rounded-full bg-zinc-500/60 dark:bg-white/40" aria-hidden />
                Confirm password
              </label>
              <div className="relative">
                <GInput.Form
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  label=""
                  control={form.control}
                  placeholder="••••••••"
                  className={`${inputDark} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={showConfirmPass ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPass ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div {...fadeUpAnimation(10, 0.35, 0.26)}>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="relative h-12 w-full rounded-xl border-0 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-600 font-semibold text-white shadow-[0_8px_28px_-6px_rgba(20,184,166,0.45),0_0_0_1px_rgba(255,255,255,0.08)_inset] transition-all hover:from-sky-400 hover:via-teal-400 hover:to-emerald-500 hover:shadow-[0_12px_36px_-8px_rgba(45,212,191,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:shadow-none"
              >
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.p
          className="relative mt-8 text-center text-sm text-zinc-600 dark:text-slate-400/90"
          {...fadeRightAnimation(8, 0.35, 0.3)}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-900 underline-offset-2 transition-colors hover:text-zinc-700 hover:underline dark:text-white/95 dark:hover:text-white"
          >
            Sign in
          </Link>
        </motion.p>
      </div>
    </motion.div>
  );
}



