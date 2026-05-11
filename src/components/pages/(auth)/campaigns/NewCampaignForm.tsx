"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Info, Rocket, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ─────────────────────────────────────────────────────────────────

type CampaignType =
  | "cold_outreach"
  | "recruiting"
  | "networking"
  | "partnerships"
  | "investor_outreach"
  | "job_application"
  | "product_marketing";
type Tone = "formal" | "friendly" | "persuasive" | "casual";
type PermissionMode = "draft" | "send";

interface FormData {
  name: string;
  campaignType: CampaignType | "";
  goal: string;
  productInfo: string;
  targetLocation: string;
  targetIndustry: string;
  targetBusinessType: string;
  targetRole: string;
  targetCompanySize: string;
  additionalCriteria: string;
  emailLimit: number;
  tone: Tone | "";
  permissionMode: PermissionMode | "";
}

const INITIAL: FormData = {
  name: "",
  campaignType: "",
  goal: "",
  productInfo: "",
  targetLocation: "",
  targetIndustry: "",
  targetBusinessType: "",
  targetRole: "",
  targetCompanySize: "",
  additionalCriteria: "",
  emailLimit: 50,
  tone: "",
  permissionMode: "",
};

// ─── Constants ──────────────────────────────────────────────────────────────

const STEPS = [
  {
    label: "Basics",
    heading: "Campaign basics",
    desc: "Name your campaign, pick a type, and describe your goal and offering.",
  },
  {
    label: "Targeting",
    heading: "Target audience",
    desc: "Define who you want to reach. All fields are optional.",
  },
  {
    label: "Settings",
    heading: "Send settings",
    desc: "Choose tone, send mode, and set a prospect limit.",
  },
  {
    label: "Review",
    heading: "Review & create",
    desc: "Check everything looks good, then create your campaign.",
  },
];

const CAMPAIGN_TYPES = [
  { value: "cold_outreach", label: "Cold outreach" },
  { value: "recruiting", label: "Recruiting" },
  { value: "networking", label: "Networking" },
  { value: "partnerships", label: "Partnerships" },
  { value: "investor_outreach", label: "Investor outreach" },
  { value: "job_application", label: "Job application" },
  { value: "product_marketing", label: "Product marketing" },
];

const SIZES = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–1,000 employees",
  "1,000+ employees",
];

const TONES: { value: Tone; label: string; sub: string }[] = [
  { value: "formal", label: "Formal", sub: "Professional & structured" },
  { value: "friendly", label: "Friendly", sub: "Warm & approachable" },
  {
    value: "persuasive",
    label: "Persuasive",
    sub: "Compelling & action-driven",
  },
  { value: "casual", label: "Casual", sub: "Relaxed & conversational" },
];

const MODES: { value: PermissionMode; label: string; sub: string }[] = [
  {
    value: "draft",
    label: "Save as drafts",
    sub: "Review emails before they send",
  },
  {
    value: "send",
    label: "Send automatically",
    sub: "Emails go out without review",
  },
];

// ─── Animation variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 24 : -24,
    opacity: 0,
  }),
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

// ─── Shared primitives ────────────────────────────────────────────────────────

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground"
    >
      {children}
    </Label>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-muted-foreground/55 leading-relaxed">
      {children}
    </p>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
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
          : "border-border bg-card hover:bg-accent/40 hover:border-border/80",
      )}
    >
      <span
        className={cn(
          "text-[13px] font-medium mb-0.5",
          selected ? "text-primary" : "text-foreground/80",
        )}
      >
        {label}
      </span>
      <span className="text-[11px] text-muted-foreground/55 leading-relaxed">
        {sub}
      </span>
    </button>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-5 gap-3">
        <Field label="Campaign name" htmlFor="name" className="col-span-3">
          <Input
            id="name"
            placeholder="London Plumbers — May 2026"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Field>
        <Field label="Type" htmlFor="ctype" className="col-span-2">
          <Select
            value={data.campaignType || undefined}
            onValueChange={(v) => onChange("campaignType", v)}
          >
            <SelectTrigger id="ctype" className="w-full">
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {CAMPAIGN_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Campaign goal"
        htmlFor="goal"
        hint="What you're trying to achieve. The AI uses this to find and qualify prospects."
      >
        <Textarea
          id="goal"
          rows={3}
          placeholder="Find plumbers in London who need a modern website — reach out with a tailored pitch…"
          value={data.goal}
          onChange={(e) => onChange("goal", e.target.value)}
        />
      </Field>

      <Field
        label="What you're offering"
        htmlFor="product"
        hint="Be specific — prices, timelines, social proof. Used verbatim when crafting emails."
      >
        <Textarea
          id="product"
          rows={4}
          placeholder="We build fast, affordable websites for tradespeople. £800–£1,500, 2-week turnaround. 50+ UK plumbers served…"
          value={data.productInfo}
          onChange={(e) => onChange("productInfo", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location" htmlFor="loc">
          <Input
            id="loc"
            placeholder="London, UK"
            value={data.targetLocation}
            onChange={(e) => onChange("targetLocation", e.target.value)}
          />
        </Field>
        <Field label="Industry" htmlFor="ind">
          <Input
            id="ind"
            placeholder="Plumbing"
            value={data.targetIndustry}
            onChange={(e) => onChange("targetIndustry", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Business type" htmlFor="biz">
          <Input
            id="biz"
            placeholder="Small business"
            value={data.targetBusinessType}
            onChange={(e) => onChange("targetBusinessType", e.target.value)}
          />
        </Field>
        <Field label="Contact role" htmlFor="role">
          <Input
            id="role"
            placeholder="Owner, Founder, CTO"
            value={data.targetRole}
            onChange={(e) => onChange("targetRole", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Company size">
        <Select
          value={data.targetCompanySize || undefined}
          onValueChange={(v) => onChange("targetCompanySize", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any size" />
          </SelectTrigger>
          <SelectContent>
            {SIZES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        label="Additional criteria"
        htmlFor="extra"
        hint="All fields optional — more detail means better prospect selection."
      >
        <Textarea
          id="extra"
          rows={3}
          placeholder="e.g. must have a website older than 3 years, Greater London only, no franchise chains…"
          value={data.additionalCriteria}
          onChange={(e) => onChange("additionalCriteria", e.target.value)}
        />
      </Field>
    </div>
  );
}

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (k: keyof FormData, v: string | number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <FieldLabel>Tone</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((t) => (
            <Tile
              key={t.value}
              label={t.label}
              sub={t.sub}
              selected={data.tone === t.value}
              onClick={() => onChange("tone", t.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Send mode</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map((m) => (
            <Tile
              key={m.value}
              label={m.label}
              sub={m.sub}
              selected={data.permissionMode === m.value}
              onClick={() => onChange("permissionMode", m.value)}
            />
          ))}
        </div>
      </div>

      <Field
        label="Prospect limit"
        htmlFor="limit"
        hint="We stop discovering new prospects once this limit is reached."
      >
        <div className="flex items-center gap-3">
          <Input
            id="limit"
            type="number"
            min={1}
            max={1000}
            className="w-24"
            value={data.emailLimit}
            onChange={(e) => onChange("emailLimit", Number(e.target.value))}
          />
          <span className="text-sm text-muted-foreground/60">
            maximum prospects
          </span>
        </div>
      </Field>
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const typeLabel =
    CAMPAIGN_TYPES.find((t) => t.value === data.campaignType)?.label ?? "—";
  const toneLabel = TONES.find((t) => t.value === data.tone)?.label ?? "—";
  const modeLabel =
    data.permissionMode === "draft"
      ? "Save as drafts"
      : data.permissionMode === "send"
        ? "Send automatically"
        : "—";

  const rows = [
    { key: "Name", val: data.name },
    { key: "Type", val: typeLabel },
    { key: "Goal", val: data.goal },
    { key: "Offering", val: data.productInfo },
    data.targetLocation && { key: "Location", val: data.targetLocation },
    data.targetIndustry && { key: "Industry", val: data.targetIndustry },
    data.targetBusinessType && {
      key: "Business type",
      val: data.targetBusinessType,
    },
    data.targetRole && { key: "Contact role", val: data.targetRole },
    data.targetCompanySize && {
      key: "Company size",
      val: data.targetCompanySize,
    },
    data.additionalCriteria && {
      key: "Extra criteria",
      val: data.additionalCriteria,
    },
    { key: "Tone", val: toneLabel },
    { key: "Mode", val: modeLabel },
    { key: "Email limit", val: `${data.emailLimit} max` },
  ].filter(Boolean) as { key: string; val: string }[];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-border overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-6 px-4 py-2.5 text-sm",
              i !== rows.length - 1 && "border-b border-border/50",
            )}
          >
            <span className="w-28 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/55 pt-0.5">
              {row.key}
            </span>
            <span className="text-foreground/80 leading-relaxed">
              {row.val || "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2.5 rounded-md bg-muted/30 border border-border/50 px-3.5 py-3 text-[12px] text-muted-foreground leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
        Campaign saved as a draft. Connect a Gmail or Outlook inbox in Settings
        to start sending.
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NewCampaignForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const createCampaign = useMutation(api.campaigns.mutations.create);

  function onChange(key: keyof FormData, value: string | number) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance() {
    if (step === 0)
      return !!(
        data.name &&
        data.campaignType &&
        data.goal &&
        data.productInfo
      );
    if (step === 2)
      return !!(data.tone && data.permissionMode && data.emailLimit > 0);
    return true;
  }

  function goTo(i: number) {
    if (i < step) {
      setDir(-1);
      setStep(i);
    }
  }

  function next() {
    if (canAdvance() && step < STEPS.length - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await createCampaign({
        name: data.name,
        goal: data.goal,
        productInfo: data.productInfo,
        campaignType: data.campaignType as CampaignType,
        targetLocation: data.targetLocation || undefined,
        targetIndustry: data.targetIndustry || undefined,
        targetBusinessType: data.targetBusinessType || undefined,
        targetRole: data.targetRole || undefined,
        targetCompanySize: data.targetCompanySize || undefined,
        additionalCriteria: data.additionalCriteria || undefined,
        emailLimit: data.emailLimit,
        tone: data.tone as Tone,
        permissionMode: data.permissionMode as PermissionMode,
        connectedInboxId: "placeholder",
      });
      toast.success("Campaign created!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-border shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">New campaign</h1>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
            Fill in the steps below to set up your campaign
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/dashboard")}
          className="text-muted-foreground hover:text-foreground"
        >
          <X />
        </Button>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar nav */}
        <nav
          className="w-52 shrink-0 border-r border-border flex flex-col gap-0.5 p-3"
          aria-label="Steps"
        >
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                disabled={i > step}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors",
                  current
                    ? "bg-accent"
                    : done
                      ? "hover:bg-accent/50 cursor-pointer"
                      : "opacity-40 cursor-default",
                )}
              >
                <div
                  className={cn(
                    "w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-all",
                    "text-[9px] font-semibold",
                    done
                      ? "bg-primary border-primary text-primary-foreground"
                      : current
                        ? "border-foreground/50 text-foreground"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-[13px] transition-colors",
                    current
                      ? "font-medium text-foreground"
                      : done
                        ? "text-foreground/55"
                        : "text-muted-foreground/50",
                  )}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="px-8 py-7"
            >
              <div className="mb-6">
                <h2 className="text-base font-semibold text-foreground mb-1">
                  {STEPS[step].heading}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {STEPS[step].desc}
                </p>
              </div>

              {step === 0 && <Step1 data={data} onChange={onChange} />}
              {step === 1 && <Step2 data={data} onChange={onChange} />}
              {step === 2 && <Step3 data={data} onChange={onChange} />}
              {step === 3 && <Step4 data={data} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-3.5 border-t border-border shrink-0 bg-muted/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={back}
          disabled={step === 0}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {isLast ? (
          <Button
            onClick={submit}
            disabled={loading}
            size="sm"
            className="gap-2"
          >
            <Rocket className="w-4 h-4" />
            {loading ? "Creating…" : "Create campaign"}
          </Button>
        ) : (
          <Button
            onClick={next}
            disabled={!canAdvance()}
            size="sm"
            className="gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
