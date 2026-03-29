"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GInput from "@/components/common/GInput";
import { login, setAxiosAuthToken } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { setAuth } from "@/context/slice/auth.slice";
import { toast } from "sonner";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await login(values);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));
      setAxiosAuthToken(res.accessToken);
      dispatch(setAuth(res));
      router.replace("/");
      toast.success("Welcome Back 🎉");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-3xl p-8 space-y-8 m-4">
          <div className="text-center space-y-3">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome
                <span className="inline-block animate-bounce">👋</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                Login to <span className="text-blue-400">FuelMap.bd</span>
              </p>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="transition-all duration-300 group-focus-within:scale-[1.01]">
                  <GInput.Form
                    type="email"
                    name="email"
                    label=""
                    control={form.control}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="transition-all duration-300 group-focus-within:scale-[1.01]">
                  <GInput.Form
                    type="password"
                    name="password"
                    label=""
                    control={form.control}
                    placeholder="password"
                  />
                </div>
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={`
                relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white tracking-wide
                transition-all duration-300 active:scale-[0.98]
                ${
                  form.formState.isSubmitting
                    ? "bg-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                }
              `}
              >
                <span
                  className={`flex items-center justify-center transition-opacity ${
                    form.formState.isSubmitting ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Sign In
                </span>

                {form.formState.isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
              Or Continue With
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
              />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white">
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                className="w-5 h-5"
              />
              Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <span className="text-blue-400 font-bold hover:text-blue-300 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
