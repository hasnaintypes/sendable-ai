"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Target,
  Users,
  FileText,
  Mail,
  ArrowUpRight,
  Zap,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function AnimatedProgress({
  value,
  delay = 0,
}: {
  value: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : {}}
        transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
      />
    </div>
  );
}

function AnimatedChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const points = [
    { x: 0, y: 60 },
    { x: 16, y: 48 },
    { x: 32, y: 52 },
    { x: 48, y: 35 },
    { x: 64, y: 40 },
    { x: 80, y: 22 },
    { x: 100, y: 12 },
  ];

  const pathD = points.reduce((acc, point, i) => {
    return i === 0
      ? `M ${point.x} ${point.y}`
      : `${acc} L ${point.x} ${point.y}`;
  }, "");

  return (
    <svg ref={ref} viewBox="0 0 100 70" className="w-full h-20">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isInView && (
        <>
          <path
            d={`${pathD} L 100 70 L 0 70 Z`}
            fill="url(#chartGrad)"
            className="text-primary"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2.5"
              className="fill-primary"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.3 }}
            />
          ))}
        </>
      )}
    </svg>
  );
}

export function BentoGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-sm font-medium"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Turn cold leads into
            <br />
            <span className="text-primary">warm conversations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Write emails that get replies, not ignored. Sendable researches your
            prospects, crafts personalized messages, and follows up
            automatically.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Hero Card - AI Email Generation */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative rounded-2xl bg-gradient-to-br from-primary/5 via-card to-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    AI Email Generation
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    One click. Fully personalized email. Subject lines that get
                    opened, body copy that resonates, and CTAs that drive
                    action.
                  </p>
                </div>
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                {[
                  { label: "Avg. Open Rate", value: 68, suffix: "%" },
                  { label: "Reply Rate", value: 24, suffix: "%" },
                  { label: "Emails / min", value: 50, suffix: "+" },
                  { label: "Time Saved", value: 85, suffix: "%" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="text-2xl font-bold text-foreground mb-0.5">
                      <AnimatedCounter
                        target={metric.value}
                        suffix={metric.suffix}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Intent-Based Engine */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10 w-fit mb-4">
              <Target className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Intent-Based Engine
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              Match tone to context automatically. Every message lands right
              whether you&apos;re closing a deal or reaching out cold.
            </p>
            <div className="space-y-3">
              {[
                { label: "Sales", value: 92 },
                { label: "Recruiting", value: 87 },
                { label: "Networking", value: 78 },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">
                      {item.value}%
                    </span>
                  </div>
                  <AnimatedProgress value={item.value} delay={i * 0.15} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Audience Research */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10 w-fit mb-4">
              <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Audience Research
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Know your prospects before you write. AI scans their web presence
              and surfaces the hooks that make outreach feel personal.
            </p>
            <div className="rounded-lg bg-muted/50 border border-border/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">
                  Discovery Rate
                </span>
              </div>
              <AnimatedChart />
            </div>
          </motion.div>

          {/* Rich Editor */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10 w-fit mb-4">
              <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Rich Editor
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Write in Markdown or WYSIWYG. Rewrite with AI inline, track
              versions, and polish every draft before it sends.
            </p>
            <div className="space-y-2">
              {["Markdown", "WYSIWYG", "AI Rewrite", "Version History"].map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ),
              )}
            </div>
          </motion.div>

          {/* Smart Follow-ups */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10 w-fit mb-4">
              <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Smart Follow-ups
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Never let a lead go cold. Automated sequences keep the
              conversation going until you get the reply.
            </p>
            {/* Sequence visualization */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step, i) => (
                <div key={step} className="flex items-center gap-1.5">
                  <motion.div
                    className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-medium text-primary"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.3 }}
                  >
                    {step}
                  </motion.div>
                  {i < 3 && (
                    <motion.div
                      className="w-4 h-px bg-border"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
              <span className="text-xs text-muted-foreground ml-2">steps</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
