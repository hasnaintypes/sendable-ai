"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ArrowLeft, Rocket } from "lucide-react";

type CampaignType = "cold_outreach" | "recruiting" | "networking" | "partnerships" | "investor_outreach" | "job_application" | "product_marketing";
type Tone = "formal" | "friendly" | "persuasive" | "casual";
type PermissionMode = "draft" | "send";

interface FormData {
  name: string; campaignType: CampaignType | ""; goal: string; productInfo: string;
  targetLocation: string; targetIndustry: string; targetBusinessType: string;
  targetRole: string; targetCompanySize: string; additionalCriteria: string;
  emailLimit: number; tone: Tone | ""; permissionMode: PermissionMode | "";
}

const INITIAL: FormData = {
  name: "", campaignType: "", goal: "", productInfo: "",
  targetLocation: "", targetIndustry: "", targetBusinessType: "",
  targetRole: "", targetCompanySize: "", additionalCriteria: "",
  emailLimit: 50, tone: "", permissionMode: "",
};

const STEPS = [
  { num: "01", label: "BASICS", heading: "Define your\ncampaign.", desc: "Name your campaign and describe what you're trying to achieve and what you're offering." },
  { num: "02", label: "TARGETING", heading: "Who are you\nreaching?", desc: "Define the audience. The AI uses these signals to discover and qualify prospects. All fields optional." },
  { num: "03", label: "SETTINGS", heading: "How should\nwe send it?", desc: "Set the tone, send mode, and the maximum number of emails for this campaign." },
  { num: "04", label: "REVIEW", heading: "Ready to\nlaunch?", desc: "Review your campaign details before saving. Launch once you connect an inbox." },
];

const CAMPAIGN_TYPES = [
  { value: "cold_outreach", label: "Cold Outreach" }, { value: "recruiting", label: "Recruiting" },
  { value: "networking", label: "Networking" }, { value: "partnerships", label: "Partnerships" },
  { value: "investor_outreach", label: "Investor Outreach" }, { value: "job_application", label: "Job Application" },
  { value: "product_marketing", label: "Product Marketing" },
];

const TONES = [
  { value: "formal", label: "Formal", sub: "Professional & structured" },
  { value: "friendly", label: "Friendly", sub: "Warm & approachable" },
  { value: "persuasive", label: "Persuasive", sub: "Compelling & action-driven" },
  { value: "casual", label: "Casual", sub: "Relaxed & conversational" },
];

const SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "201–1,000 employees", "1,000+ employees"];

const INPUT_CLS = "bg-card border-border text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-brand rounded-sm h-12 text-sm placeholder:text-muted-foreground/40 transition-colors";
const TEXTAREA_CLS = "bg-card border-border text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-brand rounded-sm text-sm placeholder:text-muted-foreground/40 resize-none transition-colors";
const LBL = "text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/60 uppercase mb-2 block";
const HINT = "text-[11px] text-muted-foreground/40 mt-1.5 leading-relaxed";

function Lbl({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label className={LBL} htmlFor={htmlFor}>{children}</label>;
}

function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <Lbl htmlFor="name">Campaign name</Lbl>
          <Input id="name" className={INPUT_CLS} placeholder="London Plumbers — May 2026" value={data.name} onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div className="col-span-2">
          <Lbl htmlFor="type">Type</Lbl>
          <Select value={data.campaignType} onValueChange={(v) => onChange("campaignType", v)}>
            <SelectTrigger id="type" className={cn(INPUT_CLS, "w-full")}><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent className="bg-card border-border rounded-sm">
              {CAMPAIGN_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-foreground focus:bg-accent focus:text-accent-foreground rounded-sm">{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Lbl htmlFor="goal">Campaign goal</Lbl>
        <Textarea id="goal" className={TEXTAREA_CLS} rows={4} placeholder="Find plumbers in London who need a modern website — reach out with a tailored pitch…" value={data.goal} onChange={(e) => onChange("goal", e.target.value)} />
        <p className={HINT}>Describe what you're trying to achieve. The AI uses this to find and qualify prospects.</p>
      </div>
      <div>
        <Lbl htmlFor="product">What you're offering</Lbl>
        <Textarea id="product" className={TEXTAREA_CLS} rows={5} placeholder="We build fast, affordable websites for tradespeople. Typically £800–£1,500, 2-week turnaround. 50+ UK plumbers served…" value={data.productInfo} onChange={(e) => onChange("productInfo", e.target.value)} />
        <p className={HINT}>Be specific — include prices, timelines, and social proof. The AI uses this verbatim when crafting emails.</p>
      </div>
    </div>
  );
}

function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><Lbl htmlFor="loc">Location</Lbl><Input id="loc" className={INPUT_CLS} placeholder="London, UK" value={data.targetLocation} onChange={(e) => onChange("targetLocation", e.target.value)} /></div>
        <div><Lbl htmlFor="ind">Industry</Lbl><Input id="ind" className={INPUT_CLS} placeholder="Plumbing" value={data.targetIndustry} onChange={(e) => onChange("targetIndustry", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Lbl htmlFor="biz">Business type</Lbl><Input id="biz" className={INPUT_CLS} placeholder="Small business" value={data.targetBusinessType} onChange={(e) => onChange("targetBusinessType", e.target.value)} /></div>
        <div><Lbl htmlFor="role">Contact role</Lbl><Input id="role" className={INPUT_CLS} placeholder="Owner, Founder, CTO" value={data.targetRole} onChange={(e) => onChange("targetRole", e.target.value)} /></div>
      </div>
      <div>
        <Lbl htmlFor="size">Company size</Lbl>
        <Select value={data.targetCompanySize} onValueChange={(v) => onChange("targetCompanySize", v)}>
          <SelectTrigger id="size" className={cn(INPUT_CLS, "w-full")}><SelectValue placeholder="Any size" /></SelectTrigger>
          <SelectContent className="bg-card border-border rounded-sm">
            {SIZES.map((s) => <SelectItem key={s} value={s} className="text-foreground focus:bg-accent focus:text-accent-foreground rounded-sm">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Lbl htmlFor="extra">Additional criteria</Lbl>
        <Textarea id="extra" className={TEXTAREA_CLS} rows={7} placeholder="Any other notes — e.g. must have a website older than 3 years, Greater London only, no franchise chains…" value={data.additionalCriteria} onChange={(e) => onChange("additionalCriteria", e.target.value)} />
        <p className={HINT}>All fields optional. More detail = better prospect selection.</p>
      </div>
    </div>
  );
}

function Step3({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string | number) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <Lbl>Email tone</Lbl>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {TONES.map((t) => {
            const active = data.tone === t.value;
            return (
              <button key={t.value} type="button" onClick={() => onChange("tone", t.value)}
                className={cn("flex flex-col items-start gap-1 border p-5 text-left transition-all rounded-sm",
                  active ? "border-brand bg-brand/5" : "border-border bg-card hover:border-border/80")}>
                <span className={cn("text-sm font-semibold", active ? "text-brand" : "text-foreground/80")}>{t.label}</span>
                <span className="text-xs text-muted-foreground/50">{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Lbl>Permission mode</Lbl>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { value: "draft", label: "Save as drafts", sub: "Emails land in Gmail drafts — you review before sending" },
            { value: "send", label: "Send automatically", sub: "Emails sent directly without manual review" },
          ].map((m) => {
            const active = data.permissionMode === m.value;
            return (
              <button key={m.value} type="button" onClick={() => onChange("permissionMode", m.value)}
                className={cn("flex flex-col items-start gap-1 border p-5 text-left transition-all rounded-sm",
                  active ? "border-brand bg-brand/5" : "border-border bg-card hover:border-border/80")}>
                <span className={cn("text-sm font-semibold", active ? "text-brand" : "text-foreground/80")}>{m.label}</span>
                <span className="text-xs text-muted-foreground/50">{m.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <Lbl htmlFor="limit">Email limit</Lbl>
        <div className="flex items-center gap-4 mt-2">
          <Input id="limit" type="number" min={1} max={1000} className={cn(INPUT_CLS, "w-28")} value={data.emailLimit} onChange={(e) => onChange("emailLimit", Number(e.target.value))} />
          <span className="text-sm text-muted-foreground/50">maximum prospects for this campaign</span>
        </div>
        <p className={HINT}>We'll stop discovering prospects once this limit is reached.</p>
      </div>
    </div>
  );
}

function Step4({ data }: { data: FormData }) {
  const typeLabel = CAMPAIGN_TYPES.find((t) => t.value === data.campaignType)?.label ?? "";
  const toneLabel = TONES.find((t) => t.value === data.tone)?.label ?? "";
  const rows = [
    { label: "Name", value: data.name }, { label: "Type", value: typeLabel },
    { label: "Goal", value: data.goal }, { label: "Offering", value: data.productInfo },
    data.targetLocation && { label: "Location", value: data.targetLocation },
    data.targetIndustry && { label: "Industry", value: data.targetIndustry },
    data.targetBusinessType && { label: "Business type", value: data.targetBusinessType },
    data.targetRole && { label: "Contact role", value: data.targetRole },
    data.targetCompanySize && { label: "Company size", value: data.targetCompanySize },
    data.additionalCriteria && { label: "Extra criteria", value: data.additionalCriteria },
    { label: "Tone", value: toneLabel },
    { label: "Mode", value: data.permissionMode === "draft" ? "Save as drafts" : "Send automatically" },
    { label: "Email limit", value: `${data.emailLimit} emails max` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-6 py-3.5 border-b border-border/30">
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50 w-28 shrink-0 pt-0.5 font-medium">{row.label}</span>
          <span className="text-sm text-foreground/80 leading-relaxed">{row.value}</span>
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground/40 pt-5 leading-relaxed">Campaign saved as draft. Connect a Gmail or Outlook inbox in Settings to launch.</p>
    </div>
  );
}

export function NewCampaignForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const createCampaign = useMutation(api.campaigns.mutations.create);

  function onChange(key: keyof FormData, value: string | number) { setData((p) => ({ ...p, [key]: value })); }
  function next() { setDir(1); setStep((s) => s + 1); }
  function back() { setDir(-1); setStep((s) => s - 1); }
  function canAdvance() {
    if (step === 0) return !!(data.name && data.campaignType && data.goal && data.productInfo);
    if (step === 2) return !!(data.tone && data.permissionMode && data.emailLimit > 0);
    return true;
  }

  async function submit() {
    setLoading(true);
    try {
      await createCampaign({
        name: data.name, goal: data.goal, productInfo: data.productInfo,
        campaignType: data.campaignType as CampaignType,
        targetLocation: data.targetLocation || undefined, targetIndustry: data.targetIndustry || undefined,
        targetBusinessType: data.targetBusinessType || undefined, targetRole: data.targetRole || undefined,
        targetCompanySize: data.targetCompanySize || undefined, additionalCriteria: data.additionalCriteria || undefined,
        emailLimit: data.emailLimit, tone: data.tone as Tone,
        permissionMode: data.permissionMode as PermissionMode, connectedInboxId: "placeholder",
      });
      toast.success("Campaign created!");
      router.push("/dashboard");
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex flex-1 min-h-0 h-full overflow-hidden" style={{ fontFamily: "var(--font-space-grotesk, var(--font-sans))" }}>

      {/* LEFT PANEL */}
      <div className="w-[340px] xl:w-[380px] flex-none relative overflow-hidden flex flex-col bg-sidebar border-r border-sidebar-border">
        {/* Giant background number — sits in the middle of the panel, above step list */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden className="absolute select-none pointer-events-none text-brand"
            style={{ top: "28%", left: "-0.05em", fontSize: "clamp(140px, 18vw, 200px)", fontWeight: 900, lineHeight: 1, opacity: 0.06, letterSpacing: "-0.04em", fontFamily: "var(--font-space-grotesk, sans-serif)", zIndex: 0 }}>
            {STEPS[step].num}
          </motion.div>
        </AnimatePresence>

        <div className="relative flex flex-col h-full px-9 pt-9 pb-8" style={{ zIndex: 1 }}>
          {/* Wordmark at top — fixed margin, not auto */}
          <div className="flex items-center gap-2.5 mb-10 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-[10px] tracking-[0.22em] text-muted-foreground/50 font-semibold">SENDABLE AI</span>
          </div>

          {/* Step content — grows to fill middle space */}
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}>
                <p className="text-[10px] tracking-[0.2em] text-brand font-semibold mb-4">STEP {STEPS[step].num} — {STEPS[step].label}</p>
                <h2 className="text-[28px] xl:text-[32px] font-bold text-foreground mb-4 leading-[1.15]" style={{ whiteSpace: "pre-line" }}>
                  {STEPS[step].heading}
                </h2>
                <p className="text-[13px] text-muted-foreground/60 leading-relaxed">{STEPS[step].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step list — pinned to bottom */}
          <div className="space-y-3.5 shrink-0">
            {STEPS.map((s, i) => {
              const done = i < step; const current = i === step;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-none transition-all duration-300",
                    done ? "bg-brand border-brand" : current ? "border-brand" : "border-border/60")}>
                    {done && <Check className="w-2.5 h-2.5 text-brand-foreground" strokeWidth={3} />}
                    {current && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                  </div>
                  <span className={cn("text-[11px] tracking-[0.12em] font-medium transition-colors duration-300",
                    done ? "text-brand" : current ? "text-foreground" : "text-muted-foreground/45")}>
                    {s.num} — {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col min-h-0 bg-background"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)", backgroundSize: "28px 28px" }}>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir}
              variants={{ enter: (d: number) => ({ x: d > 0 ? 32 : -32, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d > 0 ? -32 : 32, opacity: 0 }) }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="px-10 xl:px-16 py-10">
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground/30 font-medium mb-8">{step + 1} / {STEPS.length}</p>
              {step === 0 && <Step1 data={data} onChange={onChange} />}
              {step === 1 && <Step2 data={data} onChange={onChange} />}
              {step === 2 && <Step3 data={data} onChange={onChange} />}
              {step === 3 && <Step4 data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-10 xl:px-16 py-5 border-t border-border bg-sidebar/80 backdrop-blur-sm">
          <button onClick={back} disabled={step === 0}
            className={cn("flex items-center gap-2 text-sm font-medium transition-colors",
              step === 0 ? "text-muted-foreground/20 cursor-not-allowed" : "text-muted-foreground hover:text-foreground")}>
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={!canAdvance()}
              className={cn("flex items-center gap-2.5 px-7 py-3 text-sm font-semibold rounded-sm transition-all",
                canAdvance() ? "bg-brand text-brand-foreground hover:opacity-90 active:scale-[0.98]" : "bg-muted text-muted-foreground/30 cursor-not-allowed")}>
              Continue<ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={loading}
              className="flex items-center gap-2.5 px-7 py-3 text-sm font-semibold bg-brand text-brand-foreground hover:opacity-90 active:scale-[0.98] rounded-sm transition-all">
              <Rocket className="w-4 h-4" />{loading ? "Creating…" : "Create Campaign"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
