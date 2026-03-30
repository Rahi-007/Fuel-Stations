"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl border bg-card" />{" "}
            {/* for logo */}
            <span className="text-xl font-bold tracking-tight font-salsa">
              FuelMap.bd
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-primary">
            Home
          </Link>
          <Link href="/stations" className="text-sm hover:text-primary">
            Stations
          </Link>
          <Link href="/map" className="text-sm hover:text-primary">
            Map
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Features
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden flex items-center gap-3"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-4 pb-4 space-y-3">
          <Link
            href="/"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/stations"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Stations
          </Link>
          <Link
            href="/map"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Map
          </Link>
          <Link
            href="#"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>

          <div className="flex items-center gap-3 pt-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
