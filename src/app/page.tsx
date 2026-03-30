"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { fadeRightAnimation, fadeUpAnimation } from "@/lib/motion.utils";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div {...fadeUpAnimation(10, 0.35, 0)}>
        <Header />
      </motion.div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div className="space-y-5" {...fadeUpAnimation(18, 0.5, 0.05)}>
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl"
              {...fadeUpAnimation(18, 0.5, 0.12)}
            >
              Find fuel stations fast. Plan smarter trips.
            </motion.h1>
            <motion.p
              className="text-base text-muted-foreground sm:text-lg"
              {...fadeUpAnimation(18, 0.5, 0.18)}
            >
              FuelMap helps you locate nearby petrol & diesel stations across
              Bangladesh, check availability, and save time on the road.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              {...fadeUpAnimation(18, 0.5, 0.25)}
            >
              <Button asChild className="sm:w-auto">
                <Link href="/login">Get started</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-auto">
                <Link href="#features">See features</Link>
              </Button>
            </motion.div>

            <motion.div
              className="text-sm text-muted-foreground"
              {...fadeUpAnimation(0, 0.35, 0.32)}
            >
              Built for mobile and desktop. Dark mode included.
            </motion.div>
          </motion.div>

          <motion.div
            className="rounded-2xl border bg-card p-6"
            {...fadeRightAnimation(20, 0.55, 0.1)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Quick preview</div>
                  <div className="text-xs text-muted-foreground">
                    What you’ll be able to do
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">v0.1</div>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    title: "Search by district",
                    desc: "Find stations by city/district quickly.",
                  },
                  {
                    title: "Map view",
                    desc: "See station locations on the map.",
                  },
                  {
                    title: "Availability",
                    desc: "Check fuel availability before you go.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border bg-background/50 p-4"
                    {...fadeRightAnimation(10, 0.35, 0.18 + i * 0.06)}
                  >
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="features"
          className="mt-16 border-t border-border pt-10"
          {...fadeUpAnimation(20, 0.55, 0.1)}
        >
          <motion.h2
            className="text-xl font-semibold"
            {...fadeUpAnimation(10, 0.4, 0.12)}
          >
            Features
          </motion.h2>
          <motion.ul
            className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-3"
            {...fadeUpAnimation(0, 0.35, 0.18)}
          >
            {[
              "Locate petrol and diesel stations",
              "Search by city or district",
              "Map-based station locations",
              "Filter stations by fuel type",
              "Real-time fuel availability",
              "Responsive design for mobile & desktop",
              "Dark mode support",
            ].map((feature, index) => (
              <motion.li
                key={feature}
                className="flex items-center rounded-lg border bg-card px-3 py-2"
                {...fadeRightAnimation(-8, 0.28, 0.22 + index * 0.04)}
              >
                <span className="mr-2 text-muted-foreground">✓</span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
