// sendable-web/src/components/pages/(auth)/settings/EditInboxSheet.tsx
"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type SafeInbox = {
  _id: Id<"connectedInboxes">;
  email: string;
  displayName?: string;
  provider: "gmail" | "outlook";
  permissionMode: "draft" | "send";
  status: "active" | "expired" | "revoked" | "error";
  createdAt: number;
};

interface Props {
  inbox: SafeInbox | null;
  onOpenChange: (open: boolean) => void;
}

function Tile({
  label,
  sub,
  selected,
  onClick,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-md border px-4 py-3 text-left transition-all duration-150",
        selected
          ? "border-primary/50 bg-primary/10 ring-1 ring-primary/20"
          : "border-border bg-card hover:bg-accent/40",
      )}
    >
      <span className={cn("text-[13px] font-medium mb-0.5", selected ? "text-primary" : "text-foreground/80")}>
        {label}
      </span>
      <span className="text-[11px] text-muted-foreground/55">{sub}</span>
    </button>
  );
}

export function EditInboxSheet({ inbox, onOpenChange }: Props) {
  const [displayName, setDisplayName] = useState(inbox?.displayName ?? "");
  const [permissionMode, setPermissionMode] = useState<"draft" | "send">(
    inbox?.permissionMode ?? "draft",
  );
  const [saving, setSaving] = useState(false);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  const updateInbox = useMutation(api.inboxes.mutations.update);
  const removeInbox = useMutation(api.inboxes.mutations.remove);

  useEffect(() => {
    if (inbox) {
      setDisplayName(inbox.displayName ?? "");
      setPermissionMode(inbox.permissionMode);
      setDisconnectError(null);
    }
  }, [inbox]);

  if (!inbox) return null;

  async function handleSave() {
    if (!inbox) return;
    setSaving(true);
    try {
      await updateInbox({ id: inbox._id, displayName: displayName || undefined, permissionMode });
      toast.success("Inbox updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!inbox) return;
    setDisconnectError(null);
    try {
      await removeInbox({ id: inbox._id });
      toast.success("Inbox disconnected");
      onOpenChange(false);
    } catch (err) {
      setDisconnectError(err instanceof Error ? err.message : "Failed to disconnect inbox");
    }
  }

  return (
    <Sheet open={!!inbox} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base">Edit inbox</SheetTitle>
        </SheetHeader>

        {/* Editable fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display-name" className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
              Display name
            </Label>
            <Input
              id="display-name"
              placeholder={inbox.email}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
              Send mode
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Tile
                label="Drafts only"
                sub="Review before sending"
                selected={permissionMode === "draft"}
                onClick={() => setPermissionMode("draft")}
              />
              <Tile
                label="Send automatically"
                sub="Emails go out without review"
                selected={permissionMode === "send"}
                onClick={() => setPermissionMode("send")}
              />
            </div>
            {permissionMode === "send" && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                Emails will be sent directly from this inbox without your review.
              </p>
            )}
          </div>
        </div>

        {/* Read-only info */}
        <div className="flex flex-col gap-2 rounded-md border border-border/50 bg-muted/20 px-4 py-3">
          {[
            { key: "Email", val: inbox.email },
            { key: "Provider", val: inbox.provider === "gmail" ? "Gmail" : "Outlook" },
            {
              key: "Connected",
              val: new Date(inbox.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            },
          ].map(({ key, val }) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/55">{key}</span>
              <span className="text-foreground/70">{val}</span>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving…" : "Save changes"}
        </Button>

        <Separator />

        {/* Danger zone */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Danger zone
          </p>
          {disconnectError && (
            <p className="text-sm text-destructive leading-relaxed">{disconnectError}</p>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Disconnect inbox
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect {inbox.email}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This inbox will be removed from all future campaigns. Campaigns currently running will not be interrupted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDisconnect}>
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SheetContent>
    </Sheet>
  );
}
