"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const avatars = [
  "https://img.freepik.com/free-photo/confident-cheerful-young-businesswoman_1262-20881.jpg?semt=ais_user_personalization&w=740&q=80",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMaljahFqlmPrJsv663xiZyxcc20lQ6O7uA&s",
  "https://img.freepik.com/photos-premium/portrait-femme-noire-bras-croises-avocat-dans-cabinet-avocats-pour-commerce-avocate-confiance-lieu-travail-bureau-moderne-heureux-conseiller-juridique-carriere-pour-consultant-croissance-pour-avocan_590464-363232.jpg?semt=ais_hybrid&w=740&q=80",
  "https://img.freepik.com/free-photo/confident-cheerful-young-businesswoman_1262-20881.jpg?semt=ais_user_personalization&w=740&q=80sss",
  "https://img.freepik.com/photos-premium/portrait-femme-noire-bras-croises-avocat-dans-cabinet-avocats-pour-commerce-avocate-confiance-lieu-travail-bureau-moderne-heureux-conseiller-juridique-carriere-pour-consultant-croissance-pour-avocan_590464-363232.jpg?semt=ais_hybrid&w=740&q=80",
];

const textRevealVariants: Variants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      delay: i * 0.1,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary pointer-events-none" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-muted/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
          <span className="text-sm text-muted-foreground">
            AI-Powered Email Outreach
          </span>
        </motion.div>

        {/* Headline with text mask animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 font-sans">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Cold emails.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-muted-foreground"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Powered by AI.
            </motion.span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate hyper-personalized outreach emails with AI. Automate audience
          research, intent-based generation, and follow-ups for sales,
          recruiting, and networking.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="shimmer-btn bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-medium shadow-lg"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base font-medium border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            See How It Works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center -space-x-3">
            {avatars.map((avatar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="relative"
              >
                <Image
                  src={avatar || "/placeholder.svg"}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                />
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by <span className="text-foreground font-medium">500+</span>{" "}
            sales teams & recruiters
          </p>
        </motion.div>
      </div>
    </section>
  );
}
