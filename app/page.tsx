// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Hero image carousel
  const heroSlides = [
    {
      src: "/hero-simplify.png",
      alt: "Simplify your financial journey",
    },
    {
      src: "/hero-fuel.png",
      alt: "Fuel your ambitions",
    },
    {
      src: "/hero-unlock.png",
      alt: "Unlock your Australian dream",
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  const [selectedService, setSelectedService] = useState(
    "Residential Purchase Loans"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // 6s per slide – tweak if you like

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Calculator state
  const [loanAmount, setLoanAmount] = useState(600_000);
  const [interestRate, setInterestRate] = useState(6.2);
  const [loanTerm, setLoanTerm] = useState(30);

  // Derived monthly repayment
  const monthlyRepayment = useMemo(() => {
    const P = loanAmount;
    const annual = interestRate;
    const years = loanTerm;
    const r = annual / 100 / 12;
    const n = years * 12;
    if (r === 0) return P / n;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  }, [loanAmount, interestRate, loanTerm]);

  // Format helpers
  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const formatCurrencyWithDecimals = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Theme: read from localStorage / prefers-color-scheme
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Header shadow on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      setHeaderScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window) || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Testimonials gentle auto emphasis
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Contact form submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send");
      }

      setToast({
        type: "success",
        message: "Thanks! Your enquiry has been sent to the SavantFS team.",
      });

      form.reset();
      setSelectedService("Residential Purchase Loans");
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message:
          "Something went wrong sending your enquiry. Please try again or email info@savantfs.com.au.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Near the top of HomePage component with other state:
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <>
      {/* HEADER / NAVBAR */}
      <header
        id="site-header"
        className={cn(
          "fixed top-0 inset-x-0 z-50 border-b border-transparent transition-colors",
          "backdrop-blur bg-white/70 dark:bg-neutral-950/60",
          headerScrolled && "border-neutral-200 dark:border-neutral-800 shadow"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#home"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/SavantFSLogo.png" // <-- EXACT filename in /public
              alt="Savant Financial Solutions"
              width={180} // adjust as needed
              height={45} // adjust as needed
              priority // always load immediately
              className="h-auto w-auto"
            />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-primary">
              Services
            </a>
            <a href="#process" className="hover:text-primary">
              Process
            </a>
            <a href="#testimonials" className="hover:text-primary">
              Testimonials
            </a>
            <a href="#calculator" className="hover:text-primary">
              Calculator
            </a>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              id="theme-toggle"
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-xl border-neutral-200 dark:border-neutral-800 text-sm flex items-center gap-2"
              type="button"
              onClick={toggleTheme}
            >
              <span id="theme-icon" aria-hidden="true">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
              <span className="hidden sm:inline" id="theme-label">
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
            </Button>
            <Button
              asChild
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm inline-flex items-center gap-2"
            >
              <a href="#contact">Book a Call →</a>
            </Button>
          </div>
        </div>
      </header>
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-8 z-50">
          <div className="rounded-2xl bg-card border border-border shadow-lg px-4 py-3 flex items-start gap-3 max-w-sm">
            <div
              className={cn(
                "mt-0.5 h-8 w-8 flex items-center justify-center rounded-full text-sm",
                toast.type === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {toast.type === "success" ? "✓" : "!"}
            </div>
            <div className="text-sm text-foreground flex-1">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-1 text-xs text-muted-foreground hover:text-foreground"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <main>
        {/* HERO */}
        <section
          id="home"
          className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-background to-secondary/40"
        >
          {/* soft gold glow in the corner */}
          <div className="pointer-events-none absolute -top-28 -right-40 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT COLUMN */}
            <div className="reveal">
              <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Specialist mortgage & finance advice
              </p>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Mortgages, made <span className="text-primary">clear</span>.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
                Savant helps Australians secure the right home, investment, or
                commercial finance—without the jargon. Personal advice, fast
                turnaround, and tailored options.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 shadow-glass"
                >
                  <a href="#contact">Get started →</a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-6 rounded-2xl border border-primary/40 text-primary hover:bg-primary/5 inline-flex items-center gap-2"
                >
                  <a href="#services">Explore services</a>
                </Button>
              </div>

              {/* quick trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary/10 text-[11px] text-primary font-semibold">
                    30+
                  </span>
                  <span>Lenders on panel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary/10 text-[14px] text-primary">
                    📝
                  </span>
                  <span>Paperwork handled for you</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 inline-flex items-center justify-center rounded-full bg-primary/10 text-[14px] text-primary">
                    💬
                  </span>
                  <span>Direct, ongoing support</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="reveal relative">
              <Card className="aspect-[4/3] rounded-3xl bg-card/80 border border-border/80 shadow-2xl p-6">
                <CardContent className="p-0 h-full">
                  <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    {heroSlides.map((slide, index) => (
                      <Image
                        key={slide.src}
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className={cn(
                          "absolute inset-0 object-contain sm:object-cover transition-opacity duration-700 ease-out",
                          index === heroIndex ? "opacity-100" : "opacity-0"
                        )}
                        sizes="(min-width: 1024px) 480px, 100vw"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card border border-border/80 shadow-xl p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-xl">
                  🧮
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Indicative repayments
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try our calculator below
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                How we can help
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                From first homes to complex structures, Savant Financial
                Solutions provides tailored lending and guidance across
                residential, commercial, and specialist finance.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <ServiceCard
                icon="🏡"
                title="Residential Purchase Loans"
                description="Achieve your dream of owning a home with flexible loan options, competitive rates, and expert guidance for first-time buyers and upgraders."
              />

              <ServiceCard
                icon="🏢"
                title="Commercial Purchase Loans"
                description="Secure offices, warehouses, or other commercial properties with tailored lending solutions and guidance at every step."
              />

              <ServiceCard
                icon="🔁"
                title="Refinance"
                description="Lower your rate, consolidate debt, or access equity. We review your current structure and help you move to a smarter solution."
              />

              <ServiceCard
                icon="⏱️"
                title="Bridging Finance"
                description="Short-term funding to help you move between properties without stress. Fast approvals and flexible terms to keep plans moving."
              />

              <ServiceCard
                icon="🏗️"
                title="Construction Loans"
                description="Finance to build your home or commercial project, with support through each stage—from pre-approval to completion."
              />

              <ServiceCard
                icon="🤝"
                title="NDIS Loans"
                description="Specialist lending for NDIS-approved properties or modifications, with a team that understands the program’s unique requirements."
              />

              <ServiceCard
                icon="📊"
                title="SMSF Loans"
                description="Use your self-managed super fund to invest in property or other assets, with lending structured around SMSF rules and tax benefits."
              />

              <ServiceCard
                icon="📄"
                title="Alt Doc & Low Doc Loans"
                description="Options for self-employed clients and non-traditional income. We work with you to find solutions beyond standard payslip lending."
              />

              <ServiceCard
                icon="🧭"
                title="Financial Guidance & Support"
                description="Clear, ongoing guidance to help you understand your options, make informed decisions, and stay on track with your goals."
              />
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Our simple, straightforward process
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                A guided, transparent journey from first conversation to
                settlement — refined to keep things simple and stress-free.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ProcessStep
                icon="📞"
                title="Get in touch"
                description="Share your goals with us — we listen, understand your situation, and outline your next steps."
              />
              <ProcessStep
                icon="📊"
                title="Borrowing capacity check"
                description="We run a free credit check and assess your borrowing capacity so you know what’s achievable."
              />
              <ProcessStep
                icon="📁"
                title="Gathering documents"
                description="We help you collect all required documents and understand your asset position."
              />
              <ProcessStep
                icon="🛠️"
                title="Loan preparation"
                description="We prepare your application, structuring the loan to fit your goals and strategy."
              />
              <ProcessStep
                icon="✔️"
                title="Review & submission"
                description="We review everything with you, answer questions, then lodge your application to our lenders."
              />
              <ProcessStep
                icon="⏳"
                title="Lender assessment"
                description="Approval typically takes 7–10 business days depending on circumstances."
              />
              <ProcessStep
                icon="📨"
                title="Additional info"
                description="If lenders need more details, we manage it and keep you updated at every step."
              />
              <ProcessStep
                icon="📝"
                title="Loan documents issued"
                description="Once approved, loan docs are issued—usually within 48 hours. We explain key details."
              />
              <ProcessStep
                icon="🏦"
                title="Settlement"
                description="Once docs are signed and returned, we book and settle your loan on the same day."
              />
              <ProcessStep
                icon="💳"
                title="Repayments begin"
                description="Your first repayment is due exactly one month after settlement. We're here anytime."
              />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-20 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Clients we’ve helped
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Savant clients value clear communication, sharp execution, and a
                calm, guided experience—from first conversation to settlement.
              </p>
            </div>

            <div
              className="mt-10 grid gap-6 md:grid-cols-3"
              id="testimonial-cards"
            >
              <TestimonialCard
                quote="Absolutely seamless refinance. They explained everything clearly and saved us a significant amount each month."
                name="Mia K."
              />
              <TestimonialCard
                quote="Swift pre-approval and settlement. The team handled the paperwork and kept us updated at every step."
                name="Daniel & Priya"
              />
              <TestimonialCard
                quote="Professional, responsive, and genuinely on our side. Highly recommend."
                name="Jacob R."
              />
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-3xl mb-4 font-bold tracking-tight text-foreground">
                Indicative repayment calculator
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* LEFT: Sliders & copy */}
              <div className="reveal space-y-6">
                <div className="rounded-2xl border border-border bg-card/90 p-5 sm:p-6 space-y-5">
                  {/* Loan amount */}
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-1.5">
                      <span>Loan amount</span>
                      <span className="font-medium text-foreground">
                        ${formatCurrency(loanAmount)}
                      </span>
                    </div>
                    <input
                      id="loan-amount"
                      type="range"
                      min={100_000}
                      max={2_000_000}
                      step={10_000}
                      value={loanAmount}
                      onChange={(e) =>
                        setLoanAmount(parseInt(e.target.value, 10))
                      }
                      className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>$100k</span>
                      <span>$2m</span>
                    </div>
                  </div>

                  {/* Interest rate */}
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-1.5">
                      <span>Interest rate (p.a.)</span>
                      <span className="font-medium text-foreground">
                        {interestRate.toFixed(2)}%
                      </span>
                    </div>
                    <input
                      id="interest-rate"
                      type="range"
                      min={1}
                      max={12}
                      step={0.05}
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(parseFloat(e.target.value))
                      }
                      className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>1%</span>
                      <span>12%</span>
                    </div>
                  </div>

                  {/* Term */}
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-1.5">
                      <span>Loan term</span>
                      <span className="font-medium text-foreground">
                        {loanTerm} years
                      </span>
                    </div>
                    <input
                      id="loan-term"
                      type="range"
                      min={5}
                      max={35}
                      step={1}
                      value={loanTerm}
                      onChange={(e) =>
                        setLoanTerm(parseInt(e.target.value, 10))
                      }
                      className="w-full accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>5 years</span>
                      <span>35 years</span>
                    </div>
                  </div>

                  {/* Summary chips */}
                  <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] sm:text-xs">
                    <div className="rounded-xl bg-secondary/60 px-3 py-2">
                      <div className="text-muted-foreground">Amount</div>
                      <div className="font-semibold text-foreground">
                        ${formatCurrency(loanAmount)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-secondary/60 px-3 py-2">
                      <div className="text-muted-foreground">Rate (p.a.)</div>
                      <div className="font-semibold text-foreground">
                        {interestRate.toFixed(2)}%
                      </div>
                    </div>
                    <div className="rounded-xl bg-secondary/60 px-3 py-2">
                      <div className="text-muted-foreground">Term</div>
                      <div className="font-semibold text-foreground">
                        {loanTerm} years
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Result card */}
              <div className="reveal space-y-6">
                <Card className="rounded-2xl border border-border bg-card/95 shadow-md">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Estimated monthly repayment
                        </div>
                        <div className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                          ${formatCurrencyWithDecimals(monthlyRepayment)}
                        </div>
                      </div>
                      <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
                        🧮
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                      This estimate assumes principal &amp; interest, with a
                      fixed rate over the full term, and is for illustration
                      only. It does not constitute formal advice or a loan
                      offer.
                    </p>

                    <div className="mt-6 grid gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Total term</span>
                        <span>{loanTerm} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Approx. number of repayments</span>
                        <span>{loanTerm * 12} months</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                    >
                      <a href="#contact">Get a personalised quote →</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* LEFT: details + map */}
              <div className="reveal space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Let’s talk
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-prose">
                    Tell us a little about your goals and timeline. We’ll come
                    back to you within one business day with next steps.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a href="tel:+61401656014" className="hover:underline">
                      +61 401 656 014
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <a
                      href="mailto:info@savantfs.com.au"
                      className="hover:underline"
                    >
                      info@savantfs.com.au
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📍</span>
                    <div>
                      <p>Unit 61, 150 Palmers Road</p>
                      <p>Truganina, VIC 3029</p>
                    </div>
                  </div>
                </div>

                {/* Google Map embed */}
                <div className="rounded-2xl overflow-hidden border border-border h-64 sm:h-72">
                  <iframe
                    title="Savant Financial Solutions location"
                    src="https://www.google.com/maps?q=Unit+61,+150+Palmers+Road,+Truganina,+VIC+3029&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* RIGHT: enquiry form */}
              <Card className="reveal rounded-2xl border border-border bg-gradient-to-b from-card to-secondary/40">
                <CardContent className="p-6 sm:p-8">
                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm" htmlFor="name">
                          Full name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          className="mt-1 h-11 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm" htmlFor="email">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          className="mt-1 h-11 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm" htmlFor="phone">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          className="mt-1 h-11 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Service</Label>
                        <Select
                          value={selectedService}
                          onValueChange={setSelectedService}
                        >
                          <SelectTrigger className="mt-1 h-11 rounded-xl">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential Purchase Loans">
                              Residential Purchase Loans
                            </SelectItem>
                            <SelectItem value="Commercial Purchase Loans">
                              Commercial Purchase Loans
                            </SelectItem>
                            <SelectItem value="Refinance">Refinance</SelectItem>
                            <SelectItem value="Bridging Finance">
                              Bridging Finance
                            </SelectItem>
                            <SelectItem value="Construction Loans">
                              Construction Loans
                            </SelectItem>
                            <SelectItem value="NDIS Loans">
                              NDIS Loans
                            </SelectItem>
                            <SelectItem value="SMSF Loans">
                              SMSF Loans
                            </SelectItem>
                            <SelectItem value="Alt Doc or Low Doc Loans">
                              Alt Doc or Low Doc Loans
                            </SelectItem>
                            <SelectItem value="Financial Guidance and Support">
                              Financial Guidance and Support
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* tie selected service into form data */}
                        <input
                          type="hidden"
                          name="service"
                          value={selectedService}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm" htmlFor="message">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        className="mt-1 min-h-[120px] rounded-xl"
                        placeholder="Tell us about your goals, timelines, and any properties you're considering…"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2"
                    >
                      {isSubmitting ? "Sending…" : "Send enquiry →"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to our privacy policy. We’ll
                      never share your details without your consent.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-10">
            {/* Logo + tagline */}
            <div className="flex items-center gap-4">
              <img
                src="/SavantFSLogo.png"
                alt="Savant Financial Solutions"
                className="h-12 w-auto"
              />
              <p className="text-sm text-muted-foreground max-w-xs">
                Clarity, confidence, and tailored lending solutions for every
                stage of your journey.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Credit Guide
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                Book a call →
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60"></div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 text-sm text-muted-foreground">
            {/* Left */}
            <p>
              © {new Date().getFullYear()} Savant Financial Solutions. All
              rights reserved.
            </p>

            {/* Right: Address + Contact */}
            <div className="flex flex-wrap items-center gap-5">
              <span>📍 Truganina, VIC</span>

              <a
                href="mailto:info@savantfs.com.au"
                className="hover:text-foreground transition"
              >
                info@savantfs.com.au
              </a>

              <a
                href="tel:+61401656014"
                className="hover:text-foreground transition"
              >
                +61 401 656 014
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-4 ml-2">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12"></path>
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.51 4.51 0 0 0 12 7.5zm0 7.5A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm4.8-9.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1z"></path>
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-9.5 6h-3v9h3V9zm-.2-3.2a1.8 1.8 0 1 0-1.8 1.8 1.79 1.79 0 0 0 1.8-1.8zM18 14.5c0-2.7-1.4-4-3.3-4a3 3 0 0 0-2.7 1.5v-1.4h-3v9h3v-5.1A1.86 1.86 0 0 1 14.6 13c1.2 0 1.4.9 1.4 2v5h3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Small presentational components
function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg hover:border-primary/60 transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <a
        href="#contact"
        className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
      >
        Talk to us about this →
      </a>
    </article>
  );
}

function ProcessStep({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-2xl bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Icon */}
      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary text-2xl mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Gold underline hover */}
      <span className="mt-4 h-[2px] w-0 bg-primary transition-all group-hover:w-full"></span>
    </article>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role?: string;
}) {
  return (
    <figure className="reveal relative flex h-full flex-col rounded-2xl bg-card/95 p-6 shadow-sm border border-border/60 hover:border-primary/70 hover:shadow-md transition">
      {/* subtle quote mark */}
      <div className="mb-3 text-primary text-3xl leading-none">“</div>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
        {quote}
      </p>

      <figcaption className="mt-4 pt-3 border-t border-border/60 text-sm font-medium text-foreground">
        {name}
        {role && (
          <span className="block text-xs text-muted-foreground mt-0.5">
            {role}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
