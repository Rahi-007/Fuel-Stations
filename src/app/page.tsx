"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fadeRightAnimation, fadeUpAnimation } from "@/lib/motion.utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NearbyStationsSection from "@/components/feature/NearbyStationsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div {...fadeUpAnimation(10, 0.35, 0)}>
        <Header />
      </motion.div>

      <main className="mx-auto max-w-6xl px-4">
        <section className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:items-center">
          {/* Hero copy */}
          <motion.div className="space-y-5" {...fadeUpAnimation(18, 0.5, 0.05)}>
            <motion.p
              className="inline-flex items-center rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
              {...fadeUpAnimation(10, 0.4, 0.08)}
            >
              Live fuel map for Bangladesh
            </motion.p>

            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              {...fadeUpAnimation(18, 0.5, 0.12)}
            >
              Fuel stations on one live map.
              <span className="block bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Plan smarter, refuel faster.
              </span>
            </motion.h1>

            <motion.p
              className="text-base text-muted-foreground sm:text-lg"
              {...fadeUpAnimation(18, 0.5, 0.18)}
            >
              See nearby petrol &amp; diesel pumps, check locations, and jump
              straight into the interactive map powered by OpenStreetMap.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              {...fadeUpAnimation(18, 0.5, 0.25)}
            >
              <Button asChild className="sm:w-auto">
                <Link href="/map">Open live map</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-auto">
                <Link href="/login">Sign in to save time</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual / mini map preview */}
          <motion.div
            className="overflow-hidden rounded-2xl border bg-card/80 shadow-sm"
            {...fadeRightAnimation(20, 0.55, 0.1)}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/gasStationObject.png"
                alt="Fuel station at night"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-xl border border-border/70 bg-background/90 px-3 py-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">* Live stations</p>
                  <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] font-semibold text-white -500">
                    Out Of Stock
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Open the full map to explore real stations, zoom, and search
                  by address.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* <motion.section
          id="features"
          className="mt-16 border-t border-border pt-10"
          {...fadeUpAnimation(20, 0.55, 0.1)}
        >
          <motion.h2
            className="text-xl font-semibold"
            {...fadeUpAnimation(10, 0.4, 0.12)}
          >
            What you can do
          </motion.h2>
          <motion.ul
            className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3"
            {...fadeUpAnimation(0, 0.35, 0.18)}
          >
            {[
              "Locate petrol and diesel stations on an interactive map",
              "Search by city or district and zoom into areas you care about",
              "See station details synced from OpenStreetMap data",
              "Use from mobile or desktop with dark & light themes",
              "Keep your last map center and radius between sessions",
              "Secure login with auto token handling",
            ].map((feature, index) => (
              <motion.li
                key={feature}
                className="flex items-start gap-2 rounded-lg border bg-card px-3 py-2"
                {...fadeRightAnimation(-8, 0.28, 0.22 + index * 0.04)}
              >
                <span className="mt-0.5 text-muted-foreground">✓</span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section> */}

        <div className="border-t border-border mt-12 pt-12">
          <NearbyStationsSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
