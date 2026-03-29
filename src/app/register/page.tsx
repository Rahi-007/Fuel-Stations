"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.firstName || !formData.email || !formData.password) {
      toast.error("Please fill required fields");
      setLoading(false);
      return;
    }

    console.log(formData);

    setTimeout(() => {
      toast.success("Account Created");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-5">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-slate-400 text-sm">Join FuelMap.bd</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/10 outline-none"
            />

            <input
              name="lastName"
              placeholder="Last Name (optional)"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/10 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/10 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/10 outline-none"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
