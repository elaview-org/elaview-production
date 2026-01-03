"use client";

/**
 * ============================================================================
 * HOW IT WORKS V3 - HSL THEME VARIABLES + NEXT-THEMES
 * ============================================================================
 * Uses CSS custom properties for theming with next-themes for persistence.
 * See globals.css for variable definitions.
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ShoppingCart, CheckCircle, Camera, DollarSign, Shield,
  Building, ArrowRight, ArrowLeft, Target, CreditCard, Upload,
  Clock, Zap, TrendingUp, Sun, Moon,
} from "lucide-react";

const advertiserSteps = [
  { id: "browse", title: "Browse Spaces", desc: "Explore the interactive map", icon: MapPin },
  { id: "select", title: "Select & Reserve", desc: "Pick dates, add to cart", icon: ShoppingCart },
  { id: "approval", title: "Quick Approval", desc: "Owner reviews in 24-48hrs", icon: Clock },
  { id: "payment", title: "Secure Payment", desc: "Escrow-protected checkout", icon: CreditCard },
  { id: "live", title: "Go Live", desc: "Campaign launches with proof", icon: Zap },
];

const spaceOwnerSteps = [
  { id: "list", title: "List Your Space", desc: "Upload photos, set pricing", icon: Building },
  { id: "connect", title: "Connect Payouts", desc: "Stripe setup in 5 minutes", icon: DollarSign },
  { id: "review", title: "Review Requests", desc: "Approve campaigns you like", icon: CheckCircle },
  { id: "proof", title: "Upload Proof", desc: "Photo verification", icon: Camera },
  { id: "paid", title: "Get Paid", desc: "100% of your listed price", icon: TrendingUp },
];

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const LA_CENTER = "34.0522,-118.2437";

const DARK_MAP_STYLE = "&style=element:geometry%7Ccolor:0x1b233d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d";
const LIGHT_MAP_STYLE = "&style=feature:all%7Celement:geometry%7Ccolor:0xf5f5f5&style=feature:water%7Celement:geometry%7Ccolor:0xc9e9f6&style=feature:road%7Celement:geometry%7Ccolor:0xffffff";

// ============================================================================
// SCREEN COMPONENTS
// ============================================================================

function BrowseScreen({ onComplete, isDark }: { onComplete?: () => void; isDark: boolean }) {
  const [stage, setStage] = useState(0);
  const mapStyle = isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE;
  const zoomedOutUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${LA_CENTER}&zoom=9&size=600x400&scale=2${mapStyle}&key=${GOOGLE_MAPS_KEY}`;
  const zoomedInUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${LA_CENTER}&zoom=13&size=600x400&scale=2${mapStyle}&key=${GOOGLE_MAPS_KEY}`;

  useEffect(() => {
    const timings = [1000, 1500, 1500, 1500];
    if (stage === 3) {
      const timer = setTimeout(() => onComplete?.(), timings[3]);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setStage((prev) => prev + 1), timings[stage]);
    return () => clearTimeout(timer);
  }, [stage, onComplete]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {["Location", "Type", "Price"].map((filter) => (
          <div key={filter} className="rounded-lg px-4 py-2 text-sm font-medium" style={{ background: "var(--bg-muted)", color: "var(--accent-text)" }}>
            {filter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 relative aspect-video overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-default)" }}>
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--bg-muted)" }}>
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-t-transparent" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
              </motion.div>
            )}
            {stage === 1 && (
              <motion.div key="zoomed-out" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <img src={zoomedOutUrl} alt="Map zoomed out" className="h-full w-full object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  {[[25, 35], [45, 30], [60, 45], [35, 55], [70, 60]].map(([l, t], i) => (
                    <div key={i} className="absolute h-3 w-3 rounded-full shadow-lg" style={{ left: `${l}%`, top: `${t}%`, background: "var(--accent)", boxShadow: "var(--shadow-accent)" }} />
                  ))}
                </div>
              </motion.div>
            )}
            {stage === 2 && (
              <motion.div key="zoomed-in" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <img src={zoomedInUrl} alt="Map zoomed in" className="h-full w-full object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  {[{ l: 30, t: 40, p: "$85" }, { l: 55, t: 50, p: "$100" }, { l: 45, t: 65, p: "$120" }].map((m, i) => (
                    <div key={i} className="absolute flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold shadow-lg" style={{ left: `${m.l}%`, top: `${m.t}%`, background: "var(--accent)", color: "var(--text-inverted)" }}>
                      {m.p}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {stage === 3 && (
              <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <img src={zoomedInUrl} alt="Map with selection" className="h-full w-full object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  {[{ l: 30, t: 40, p: "$85" }, { l: 45, t: 65, p: "$120" }].map((m, i) => (
                    <div key={i} className="absolute flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold opacity-50" style={{ left: `${m.l}%`, top: `${m.t}%`, background: "var(--accent)" }}>
                      {m.p}
                    </div>
                  ))}
                  <div className="absolute" style={{ left: "55%", top: "50%" }}>
                    <div className="absolute -inset-3 animate-ping rounded-full" style={{ background: "var(--accent)", opacity: 0.3 }} />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-xl" style={{ background: "var(--accent)", color: "var(--text-inverted)" }}>$100</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {stage < 3 ? (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg p-3 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                    <div className="mb-2 h-12 w-full rounded" style={{ background: "var(--bg-muted)" }} />
                    <div className="h-3 w-3/4 rounded" style={{ background: "var(--bg-muted)" }} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="details" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="rounded-lg border-2 p-3" style={{ borderColor: "var(--accent)", background: "var(--bg-card)" }}>
                  <div className="mb-2 h-12 w-full rounded" style={{ background: "var(--accent-muted)" }} />
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Billboard - LA</div>
                  <div className="text-xs font-medium" style={{ color: "var(--accent-text)" }}>$100/day</div>
                </div>
                {[2, 3].map((i) => (
                  <div key={i} className="rounded-lg p-3 opacity-50 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
                    <div className="mb-2 h-12 w-full rounded" style={{ background: "var(--bg-muted)" }} />
                    <div className="h-3 w-3/4 rounded" style={{ background: "var(--bg-muted)" }} />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function CartScreen() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-default)" }}>
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5" style={{ color: "var(--accent)" }} />
          <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Your Cart</span>
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--accent-text)" }}>2 items</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl p-4 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-linear-to-br from-cyan-500 to-cyan-400" />
            <div>
              <div className="text-base font-medium" style={{ color: "var(--text-primary)" }}>Billboard - LA</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>7 days</div>
            </div>
          </div>
          <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>$700</span>
        </div>
        <div className="flex items-center justify-between rounded-xl p-4 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
          <span className="text-base" style={{ color: "var(--text-secondary)" }}>Installation</span>
          <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>$50</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border-default)" }}>
        <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
        <span className="text-2xl font-bold" style={{ color: "var(--accent-text)" }}>$750</span>
      </div>
    </div>
  );
}

function ApprovalScreen() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "var(--accent-muted)" }}>
        <Clock className="h-10 w-10" style={{ color: "var(--accent)" }} />
      </div>
      <div>
        <h4 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Awaiting Approval</h4>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>Owner reviewing your request</p>
      </div>
      <div className="rounded-xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
        <div className="mb-3 flex items-center justify-between text-base">
          <span style={{ color: "var(--text-secondary)" }}>Status</span>
          <span className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: "var(--warning-muted)", color: "var(--warning)" }}>Pending</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full" style={{ background: "var(--progress-bg)" }}>
          <motion.div className="h-full bg-linear-to-r from-cyan-500 to-cyan-400" initial={{ width: "0%" }} animate={{ width: "65%" }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </div>
      </div>
    </div>
  );
}

function PaymentScreen() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 border" style={{ background: "var(--accent-muted)", borderColor: "var(--border-default)" }}>
        <div className="mb-2 flex items-center gap-3">
          <Shield className="h-6 w-6" style={{ color: "var(--accent)" }} />
          <span className="text-base font-semibold" style={{ color: "var(--accent-text)" }}>Escrow Protected</span>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Payment held until installation verified</p>
      </div>
      <div className="space-y-3 text-base">
        {[["Subtotal", "$750.00"], ["Platform fee (10%)", "$70.00"], ["Processing", "$24.23"]].map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span style={{ color: "var(--text-secondary)" }}>{label}</span>
            <span style={{ color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-3" style={{ borderColor: "var(--border-default)" }}>
          <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
          <span className="text-xl font-bold" style={{ color: "var(--accent-text)" }}>$844.23</span>
        </div>
      </div>
    </div>
  );
}

function LiveScreen() {
  return (
    <div className="space-y-6 text-center">
      <motion.div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-lg bg-linear-to-br from-cyan-500 to-cyan-400" style={{ boxShadow: "var(--shadow-accent)" }} initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5 }}>
        <Zap className="h-10 w-10" style={{ color: "var(--text-inverted)" }} />
      </motion.div>
      <div>
        <h4 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Campaign Live!</h4>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>Your ad is now running</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
          <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>7</div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Days Running</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
          <div className="text-3xl font-bold" style={{ color: "var(--success)" }}>✓</div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Verified</div>
        </div>
      </div>
    </div>
  );
}

function ListSpaceScreen() {
  return (
    <div className="space-y-5">
      <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed" style={{ borderColor: "var(--border-default)", background: "var(--bg-muted)" }}>
        <div className="text-center">
          <Upload className="mx-auto mb-3 h-12 w-12" style={{ color: "var(--accent)" }} />
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>Upload space photos</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-12 rounded-lg border" style={{ background: "var(--bg-input)", borderColor: "var(--border-default)" }} />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-lg border" style={{ background: "var(--bg-input)", borderColor: "var(--border-default)" }} />
          <div className="h-12 rounded-lg border" style={{ background: "var(--bg-input)", borderColor: "var(--border-default)" }} />
        </div>
      </div>
    </div>
  );
}

function ConnectPayoutsScreen() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-linear-to-br from-purple-600 to-purple-500 p-5 shadow-lg">
        <span className="text-xl font-bold text-white">stripe</span>
        <p className="mt-1 text-base text-purple-200">Connect your account</p>
      </div>
      <div className="space-y-3">
        {["Direct deposits", "Tax reporting", "Fraud protection"].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5" style={{ color: "var(--accent)" }} />
            <span className="text-base" style={{ color: "var(--text-secondary)" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewRequestScreen() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl p-5 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>New Request</span>
          <span className="rounded-full px-3 py-1 text-sm font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent-text)" }}>Pending</span>
        </div>
        <p className="mb-4 text-base" style={{ color: "var(--text-secondary)" }}>Acme Corp • 7 days • $700</p>
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg py-3 text-base font-semibold shadow-md bg-linear-to-r from-cyan-500 to-cyan-400" style={{ color: "var(--text-inverted)" }}>Approve</button>
          <button className="flex-1 rounded-lg py-3 text-base font-semibold border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}>Decline</button>
        </div>
      </div>
    </div>
  );
}

function UploadProofScreen() {
  return (
    <div className="space-y-5">
      <div className="flex aspect-video items-center justify-center rounded-xl" style={{ background: "var(--bg-muted)" }}>
        <Camera className="h-16 w-16" style={{ color: "var(--text-muted)" }} />
      </div>
      <button className="w-full rounded-lg py-4 text-base font-semibold shadow-md bg-linear-to-r from-cyan-500 to-cyan-400" style={{ color: "var(--text-inverted)" }}>Upload Installation Photo</button>
      <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>Auto-approved after 48 hours</p>
    </div>
  );
}

function GetPaidScreen() {
  return (
    <div className="space-y-6 text-center">
      <motion.div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-lg bg-linear-to-br from-emerald-500 to-emerald-400" initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 0.5 }}>
        <DollarSign className="h-10 w-10 text-white" />
      </motion.div>
      <div>
        <h4 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Payment Received!</h4>
      </div>
      <div className="rounded-xl p-5 border" style={{ background: "var(--success-muted)", borderColor: "var(--border-default)" }}>
        <div className="text-4xl font-bold" style={{ color: "var(--success)" }}>$750.00</div>
        <p className="text-base" style={{ color: "var(--success)" }}>100% of listed price</p>
      </div>
    </div>
  );
}

function ScreenContent({ id, type, onComplete, isDark }: { id: string; type: "advertiser" | "space-owner"; onComplete?: () => void; isDark: boolean }) {
  if (type === "advertiser") {
    switch (id) {
      case "browse": return <BrowseScreen onComplete={onComplete} isDark={isDark} />;
      case "select": return <CartScreen />;
      case "approval": return <ApprovalScreen />;
      case "payment": return <PaymentScreen />;
      case "live": return <LiveScreen />;
    }
  } else {
    switch (id) {
      case "list": return <ListSpaceScreen />;
      case "connect": return <ConnectPayoutsScreen />;
      case "review": return <ReviewRequestScreen />;
      case "proof": return <UploadProofScreen />;
      case "paid": return <GetPaidScreen />;
    }
  }
  return null;
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HowItWorksPage() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"advertiser" | "space-owner">("advertiser");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const steps = activeTab === "advertiser" ? advertiserSteps : spaceOwnerSteps;
  const currentStepData = steps[currentStep];
  const hasOwnTiming = activeTab === "advertiser" && currentStep === 0;

  const handleStepComplete = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  }, [steps.length]);

  useEffect(() => {
    if (hasOwnTiming) return;
    const timer = setTimeout(() => setCurrentStep((prev) => (prev + 1) % steps.length), 3000);
    return () => clearTimeout(timer);
  }, [steps.length, currentStep, hasOwnTiming]);

  useEffect(() => setCurrentStep(0), [activeTab]);

  if (!currentStepData) return null;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg-page)" }}>
      {/* Header */}
      <div className="mx-auto max-w-6xl px-4 pt-8 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="group inline-flex items-center gap-2 transition-colors" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>
        {mounted && (
          <button 
            onClick={() => setTheme(isDark ? "light" : "dark")} 
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all border" 
            style={{ background: "var(--bg-card)", borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
          >
            {isDark ? <><Sun className="h-4 w-4" /><span>Light</span></> : <><Moon className="h-4 w-4" /><span>Dark</span></>}
          </button>
        )}
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: "var(--text-primary)" }}>
          How <span className="bg-linear-to-r from-cyan-500 to-cyan-400 bg-clip-text text-transparent">Elaview</span> Works
        </h1>
        <p className="mx-auto max-w-2xl text-lg" style={{ color: "var(--text-secondary)" }}>
          The simplest way to book advertising space—or monetize yours.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl p-1.5" style={{ background: "var(--tab-bg)" }}>
            {[
              { key: "advertiser", label: "For Advertisers", icon: Target },
              { key: "space-owner", label: "For Space Owners", icon: Building },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "advertiser" | "space-owner")}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all"
                style={activeTab === tab.key ? { background: "var(--tab-active-bg)", color: "var(--tab-active-text)", boxShadow: "var(--shadow-md)" } : { color: "var(--text-secondary)" }}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Demo Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl p-2 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)", boxShadow: "var(--shadow-lg)" }}>
            <div className="relative overflow-hidden rounded-2xl">
              {/* Browser bar */}
              <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-cyan-600 to-cyan-500">
                <div className="w-4/5 rounded-lg px-5 py-2 text-sm backdrop-blur-sm bg-white/20 text-white/90">
                  elaview.com/{activeTab === "advertiser" ? "browse" : "dashboard"}
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 w-3 rounded-full bg-white/60" />
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className="p-8 lg:p-10" style={{ background: "var(--bg-muted)" }}>
                <AnimatePresence mode="wait">
                  <motion.div key={`${activeTab}-${currentStep}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="h-80 lg:h-[400px]">
                    <ScreenContent id={currentStepData.id} type={activeTab} onComplete={handleStepComplete} isDark={isDark} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Progress section */}
            <div className="p-6 lg:p-8">
              <div className="mb-4 flex justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div key={step.id} className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? "scale-110" : ""}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${isActive ? "bg-linear-to-br from-cyan-500 to-cyan-400" : ""}`} style={{ background: isActive ? undefined : "var(--bg-muted)", boxShadow: isActive ? "var(--shadow-accent)" : "none" }}>
                        <StepIcon className="h-5 w-5 transition-colors duration-500" style={{ color: isActive ? "var(--text-inverted)" : "var(--text-muted)" }} />
                      </div>
                      <span className="mt-2 text-xs font-medium transition-colors duration-500 hidden sm:block" style={{ color: isCurrent ? "var(--accent-text)" : isActive ? "var(--text-primary)" : "var(--text-muted)" }}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--progress-bg)" }}>
                <motion.div className="h-full bg-linear-to-r from-cyan-500 to-cyan-400" initial={{ width: "0%" }} animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
              </div>
              <p className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{currentStepData.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Shield, title: "Escrow Protected", desc: "Payments held securely until campaign delivery is verified." },
            { icon: Zap, title: "Fully Automated", desc: "Smart workflows handle approvals, payments, and payouts." },
            { icon: DollarSign, title: "Transparent Pricing", desc: "10% platform fee. Space owners keep 100% of listed price." },
          ].map((item) => (
            <div key={item.title} className="group rounded-2xl p-6 transition-all duration-300 border" style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "var(--accent-muted)" }}>
                <item.icon className="h-7 w-7" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="mb-2 font-bold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 border-t" style={{ background: "var(--bg-page-alt)", borderColor: "var(--border-default)" }}>
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl" style={{ color: "var(--text-primary)" }}>Ready to get started?</h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>See how Elaview can work for your business.</p>
          <button onClick={() => router.push("/request-demo")} className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-all hover:scale-105 bg-linear-to-r from-cyan-500 to-cyan-400" style={{ color: "var(--text-inverted)", boxShadow: "var(--shadow-accent)" }}>
            Request a Demo
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
