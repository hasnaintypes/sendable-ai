// sendable-web/src/components/pages/(auth)/settings/ConnectGmailDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, FileText, Eye, ShieldCheck } from "lucide-react";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -24 : 24,
    opacity: 0,
    transition: { duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.907 1.528-1.148C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectGmailDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  function next() {
    setDir(1);
    setStep(1);
  }

  function back() {
    setDir(-1);
    setStep(0);
  }

  function handleConnect() {
    window.location.href = "/api/auth/gmail";
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(0); }}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Connect an inbox
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {step === 0 && (
              <div className="flex flex-col gap-3 py-2">
                <p className="text-sm text-muted-foreground">
                  Choose the email provider you want to connect for sending campaigns.
                </p>
                <button
                  type="button"
                  onClick={next}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-all duration-150",
                    "border-primary/50 bg-primary/10 ring-1 ring-primary/20",
                  )}
                >
                  <GmailIcon className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Gmail</p>
                    <p className="text-[11px] text-muted-foreground/70">Google Workspace or personal Gmail</p>
                  </div>
                </button>
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-3 rounded-md border px-4 py-3 text-left opacity-40 cursor-not-allowed border-border bg-card"
                >
                  <div className="w-6 h-6 shrink-0 rounded bg-muted flex items-center justify-center">
                    <span className="text-[9px] font-bold text-muted-foreground">OL</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-foreground">Outlook</p>
                      <span className="text-[9px] font-medium uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                        Coming soon
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70">Microsoft 365 or personal Outlook</p>
                  </div>
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Sendable will request the following Gmail permissions:
                </p>

                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: Send,
                      label: "Send emails on your behalf",
                      reason: "For campaigns in send mode",
                    },
                    {
                      icon: FileText,
                      label: "Create and manage drafts",
                      reason: "For campaigns in draft mode",
                    },
                    {
                      icon: Eye,
                      label: "Read email threads (read-only)",
                      reason: "To detect replies and stop follow-ups automatically",
                    },
                  ].map(({ icon: Icon, label, reason }) => (
                    <div key={label} className="flex items-start gap-3 rounded-md bg-muted/30 border border-border/50 px-3 py-2.5">
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{label}</p>
                        <p className="text-[11px] text-muted-foreground/70">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 rounded-md bg-green-500/5 border border-green-500/20 px-3 py-2.5">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    We will never read your personal emails, store email content, or share your data. You can disconnect at any time.
                  </div>
                </div>

                <Button onClick={handleConnect} className="w-full gap-2">
                  <GmailIcon className="w-4 h-4" />
                  Connect Gmail
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-1">
          {step === 1 ? (
            <Button variant="ghost" size="sm" onClick={back} className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {step === 0 && (
            <Button size="sm" onClick={next} className="gap-1.5 ml-auto">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
