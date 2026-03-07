"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background via-background to-secondary relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-muted/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-7xl sm:text-8xl font-bold text-muted mb-4">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground">
            Looks like this page took a wrong turn. Don&apos;t worry, let&apos;s
            get you back on track.
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
              className="shimmer-btn bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-medium shadow-lg"
            >
              Back to Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              Explore Features
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-6">
            Need help? Let&apos;s get you back on track
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/" className="group">
              <div className="p-4 rounded-lg bg-card/50 hover:bg-accent border border-border hover:border-muted-foreground/30 transition-all">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Home
                </div>
              </div>
            </Link>
            <Link href="/#features" className="group">
              <div className="p-4 rounded-lg bg-card/50 hover:bg-accent border border-border hover:border-muted-foreground/30 transition-all">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Features
                </div>
              </div>
            </Link>
            <Link href="/#pricing" className="group">
              <div className="p-4 rounded-lg bg-card/50 hover:bg-accent border border-border hover:border-muted-foreground/30 transition-all">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
