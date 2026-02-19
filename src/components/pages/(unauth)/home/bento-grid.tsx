"use client"

import { motion, useInView, Variants } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Sparkles, Target, Users, FileText, Mail } from "lucide-react"

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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
}

function SystemStatus() {
  const [dots, setDots] = useState([true, true, true, false, true])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => prev.map(() => Math.random() > 0.2))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      {dots.map((active, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${active ? "bg-primary" : "bg-muted"}`}
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function AnimatedChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const points = [
    { x: 0, y: 60 },
    { x: 20, y: 45 },
    { x: 40, y: 55 },
    { x: 60, y: 30 },
    { x: 80, y: 40 },
    { x: 100, y: 15 },
  ]

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, "")

  return (
    <svg ref={ref} viewBox="0 0 100 70" className="w-full h-24">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isInView && (
        <>
          <path d={`${pathD} L 100 70 L 0 70 Z`} fill="url(#chartGradient)" className="opacity-50 text-primary" />
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="draw-line text-primary" />
        </>
      )}
    </svg>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Everything you need for email outreach
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            AI-powered personalization, automated research, and intelligent follow-ups. Built for sales teams, recruiters, and professionals who need results.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large card - AI Email Generation */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
                  <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">AI Email Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Generate hyper-personalized emails with AI. Context-aware body text, dynamic subject lines, and optimized CTAs tailored to your audience.
                </p>
              </div>
              <SystemStatus />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {["Subject Lines", "Body Text", "CTAs", "Follow-ups"].map((metric) => (
                <div key={metric} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">✓</div>
                  <div className="text-xs text-muted-foreground">{metric}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Intent-Based Personalization */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
              <Target className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Intent-Based Engine</h3>
            <p className="text-muted-foreground text-sm mb-6">Tailor messaging for cold outreach, follow-ups, sales pitches, or job applications. Control tone from formal to casual.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Sales</span>
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Jobs</span>
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Networking</span>
            </div>
          </motion.div>

          {/* Audience Research */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
              <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Audience Research</h3>
            <p className="text-muted-foreground text-sm mb-4">Discover leads from websites, GitHub profiles, and LinkedIn. Get AI-enriched summaries and personalization hooks.</p>
            <AnimatedChart />
          </motion.div>

          {/* Rich Email Editor */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
              <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Rich Editor</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Dual Markdown & WYSIWYG editors. Inline AI rewrites, formatting palette, and full draft version history.
            </p>
            <div className="flex items-center gap-2 text-primary text-sm">
              <span className="font-mono">Multiple formats</span>
            </div>
          </motion.div>

          {/* Follow-up Automation */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:scale-[1.02] transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-primary/10 w-fit mb-4">
              <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Follow-ups</h3>
            <p className="text-muted-foreground text-sm mb-4">Generate multi-step follow-up sequences. Auto-schedule or send manually with full control and analytics.</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Auto</span>
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Scheduled</span>
              <span className="px-2 py-1 text-xs bg-secondary rounded text-secondary-foreground">Manual</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
