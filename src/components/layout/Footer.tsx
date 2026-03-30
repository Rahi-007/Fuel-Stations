"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#0f172a] text-white mt-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-50px] left-[10%] w-[300px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-50px] right-[10%] w-[300px] h-[300px] bg-emerald-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">
              FuelMap<span className="text-blue-400">.bd</span>
            </h2>
            <p className="text-sm text-slate-400">
              Find nearby fuel stations, check availability, and plan smarter
              refueling across Bangladesh.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-slate-300">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/stations">Stations</Link>
              </li>
              <li>
                <Link href="/map">Map</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-slate-300">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-400">
              Get latest fuel updates and features.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} FuelMap.bd - Built for Bangladesh</p>

          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition">
              Facebook
            </Link>
            <Link href="#" className="hover:text-white transition">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white transition">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
