"use client";

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
import { AlertTriangle, Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface DeleteAccountDialogProps {
  trigger?: ReactNode;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  requireConfirmation?: boolean;
  confirmationText?: string;
}

export function DeleteAccountDialog({
  trigger,
  onConfirm,
  requireConfirmation = true,
  confirmationText = "DELETE",
  title = "Delete your account?",
  description = "This action is permanent and cannot be undone. Deleting your account will remove all your campaigns, leads, analytics, and integrations.",
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const canDelete = !requireConfirmation || confirmText === confirmationText;
  const isTyping = confirmText.length > 0;
  const isValid = confirmText === confirmationText;

  const handleConfirm = async () => {
    if (!canDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await onConfirm();
      setOpen(false);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setOpen(newOpen);
      if (!newOpen) {
        setConfirmText("");
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>

            <div className="space-y-1 pt-0.5">
              <AlertDialogTitle className="text-lg font-semibold">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {requireConfirmation && (
          <div className="space-y-3 py-2">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-muted-foreground">
                To confirm deletion, type{" "}
                <code className="relative rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  {confirmationText}
                </code>{" "}
                below:
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete" className="sr-only">
                Confirmation text
              </Label>
              <Input
                id="confirm-delete"
                placeholder={`Type ${confirmationText} to confirm`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isDeleting}
                className={cn(
                  "transition-colors",
                  isTyping && !isValid && "border-destructive/50 focus-visible:ring-destructive/20",
                  isValid && "border-green-500/50 focus-visible:ring-green-500/20"
                )}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={!canDelete || isDeleting}
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}