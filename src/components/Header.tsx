"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold">
          FuelMap.bd
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm hover:text-primary">
            Home
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Stations
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Map
          </Link>
          <Link href="#" className="text-sm hover:text-primary">
            Features
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button size="sm">Login</Button>
          <Button variant={"outline"} size="sm">
            Sign Up
          </Button>
        </div>

        <button
          className="md:hidden flex items-center gap-3"
          onClick={() => setOpen(!open)}
        >
          <ThemeToggle />
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-4 pb-4 space-y-3">
          <Link
            href="#"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#"
            className="block text-sm py-2"
            onClick={() => setOpen(false)}
          >
            Stations
          </Link>
          <Link
            href="#"
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
            <Button size="sm">Login</Button>
            <Button variant={"outline"} size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
