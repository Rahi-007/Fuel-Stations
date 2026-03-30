"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
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

    // simple validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    console.log(formData);

    setTimeout(() => {
      toast.success("Update Success");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl z-10">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-xl rounded-3xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-slate-400 text-sm">Join FuelMap.bd</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@gmail.com"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            />

            {/* Phone + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
              />
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Male / Female"
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
              />
            </div>

            {/* Address */}
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your location"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            />

            {/* DOB */}
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 outline-none"
            />

            {/* Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>

          {/* Footer */}
          {/* <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer">Login</span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
