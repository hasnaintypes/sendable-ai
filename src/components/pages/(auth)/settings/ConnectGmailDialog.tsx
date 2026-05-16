// sendable-web/src/components/pages/(auth)/settings/ConnectGmailDialog.tsx
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, FileText, Eye, ShieldCheck } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectGmailDialog({ open, onOpenChange }: Props) {
  function handleConnect() {
    window.location.href = "/api/auth/gmail";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Connect Gmail</DialogTitle>
        </DialogHeader>

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
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We will never read your personal emails, store email content, or share your data. You can disconnect at any time.
            </p>
          </div>

          <Button onClick={handleConnect} className="w-full gap-2">
            <Image src="/icons/google-gmail.svg" alt="Gmail" width={16} height={16} />
            Connect Gmail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
