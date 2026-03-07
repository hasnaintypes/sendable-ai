"use client";

import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const requirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

function getStrength(password: string) {
  return requirements.map((req) => ({
    met: req.regex.test(password),
    text: req.text,
  }));
}

function getStrengthScore(password: string) {
  return getStrength(password).filter((r) => r.met).length;
}

function getStrengthColor(score: number) {
  if (score === 0) return "bg-border";
  if (score <= 1) return "bg-red-500";
  if (score <= 2) return "bg-orange-500";
  if (score === 3) return "bg-amber-500";
  return "bg-emerald-500";
}

function getStrengthText(score: number) {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak password";
  if (score === 3) return "Medium password";
  return "Strong password";
}

interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  showStrength?: boolean;
  showStrengthOnSubmit?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showStrength = false,
      showStrengthOnSubmit = false,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(false);
    const [attempted, setAttempted] = React.useState(false);
    const password = typeof value === "string" ? value : "";
    const score = getStrengthScore(password);
    const strength = getStrength(password);

    const showIndicator =
      showStrength && (showStrengthOnSubmit ? attempted : password.length > 0);

    React.useEffect(() => {
      if (!showStrengthOnSubmit) return;
      const form = (ref as React.RefObject<HTMLInputElement>)?.current?.closest(
        "form",
      );
      if (!form) return;
      const handler = () => setAttempted(true);
      form.addEventListener("submit", handler);
      return () => form.removeEventListener("submit", handler);
    }, [showStrengthOnSubmit, ref]);

    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn("pe-9", className)}
            value={value}
            onChange={onChange}
            {...props}
          />
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 hover:text-foreground transition outline-none"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="size-4" strokeWidth={2} />
            ) : (
              <Eye className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {showIndicator && (
          <>
            <div
              className="bg-border mb-3 mt-3 h-1 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-label="Password strength"
            >
              <div
                className={cn(
                  "h-full transition-all duration-500 ease-out",
                  getStrengthColor(score),
                )}
                style={{ width: `${(score / 4) * 100}%` }}
              />
            </div>

            <p className="mb-2 text-sm font-medium text-foreground">
              {getStrengthText(score)}. Must contain:
            </p>

            <ul className="space-y-1.5" aria-label="Password requirements">
              {strength.map((req, i) => (
                <li key={i} className="flex items-center gap-2">
                  {req.met ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <X className="size-4 text-muted-foreground/50" />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      req.met
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground/80",
                    )}
                  >
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
