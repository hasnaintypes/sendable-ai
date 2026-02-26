"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-7xl sm:text-8xl font-bold text-zinc-800 mb-4">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-zinc-400">
            Looks like this page took a wrong turn. Don't worry, let's get you
            back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/">
            <Button
              size="lg"
              className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-8 h-12 text-base font-medium shadow-lg shadow-white/10"
            >
              Back to Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 bg-transparent"
            >
              Explore Features
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-800"
        >
          <p className="text-sm text-zinc-500 mb-6">
            Need help? Let's get you back on track
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/" className="group">
              <div className="p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  Home
                </div>
              </div>
            </Link>
            <Link href="/#features" className="group">
              <div className="p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  Features
                </div>
              </div>
            </Link>
            <Link href="/#pricing" className="group">
              <div className="p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  Pricing
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
