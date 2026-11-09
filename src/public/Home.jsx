/**
 * E/FIT – Personal Trainer Website (Home page) — static version, no animations
 * ------------------------------------------------------------------
 * Sections (top to bottom):
 *   1. Hero            – intro, white blocks + hero image
 *   2. Programs        – big stacked program names with hover labels
 *   3. About           – headline + short pitch + booking link
 *   3b. Trainer facts  – certifications, specialties, approach, locations
 *   3c. How it works   – 3-step process
 *   4. Plans           – three coaching plans (pricing)
 *   5. Results         – stats + client testimonials
 *   5b. FAQ            – accordion
 *   6. Footer / Contact
 *
 * No dependencies beyond React and Tailwind (framer-motion is no longer needed).
 *
 * NOTE: All copy, prices, stats and testimonials are PLACEHOLDERS.
 */
import React, { useState } from "react";
import hero from "../../public/hero.png";
import herot from "../../public/hero text.png"
import Header from "../components/PublicHeader";

/* =================================================================
   DATA
   ================================================================= */

const programs = [

  { name: "STRENGTH", label: "1-to-1 · 60 min" },
  { name: "POWER", label: "Explosive training" },
  { name: "HYPERTROPHY", label: "Muscle building" },
  { name: "FAT LOSS", label: "Body recomposition" },
  { name: "MOBILITY", label: "Move pain-free" },
  { name: "ENDURANCE", label: "Conditioning" },
  { name: "BOXING FIT", label: "Pads & footwork" },

  { name: "ONLINE", label: "Train anywhere" },
];

const plans = [
  {
    name: "Starter",
    price: "₹4,999",
    note: "per month",
    features: ["4 personal sessions", "Form & technique coaching", "Starter nutrition guide"],
  },
  {
    name: "Performance",
    price: "₹12,999",
    note: "per month",
    featured: true,
    features: [
      "12 personal sessions",
      "Fully custom program",
      "Weekly progress check-ins",
      "Personal nutrition plan",
    ],
  },
  {
    name: "Online",
    price: "₹6,999",
    note: "per month",
    features: ["Custom app-based program", "Video form checks", "Weekly 1-to-1 call"],
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Clients trained" },
  { value: 12, suffix: "", label: "Years coaching" },
  { value: 95, suffix: "%", label: "Reach their goal" },
];

const testimonials = [
  { quote: "I lost 14 kg in five months and, for the first time, I enjoy training.", who: "Anjali M.", tag: "Fat loss" },
  { quote: "My back pain stopped running my week. Every session had a clear purpose.", who: "Rahul K.", tag: "Rehab" },
  { quote: "I added 40 kg to my deadlift in a year without a single injury.", who: "Sana P.", tag: "Strength" },
];

const facts = [
  { h: "Certified", t: "NASM-CPT, Precision Nutrition Level 1, First Aid & CPR" },
  { h: "Specialties", t: "Strength, fat loss, injury rehab, mobility and boxing fitness" },
  { h: "Approach", t: "Assessment first. Every session is logged, so progress is measured, not guessed." },
  { h: "Where", t: "In the studio, at your home or gym, or fully online." },
];

const steps = [
  { n: "01", h: "Free intro session", t: "A 30-minute chat and movement screen. We talk goals, injuries, schedule and what you enjoy." },
  { n: "02", h: "Assessment & plan", t: "You get a written program built around your results, with clear targets for the first 12 weeks." },
  { n: "03", h: "Train, track, adjust", t: "Every session is logged. We review numbers monthly and change the plan as you get stronger." },
];

const faqs = [
  { q: "I'm a complete beginner. Is that okay?", a: "Yes. Most clients start with little or no experience. We begin with the basics and progress at a pace that suits your body." },
  { q: "How many sessions a week do I need?", a: "Two to three sessions a week is the sweet spot for most goals. We decide together in your intro session." },
  { q: "Do you help with food and nutrition?", a: "Yes. The Performance plan includes a personal nutrition plan, and every plan includes simple eating guidelines." },
  { q: "Can I train online if I live far away?", a: "Absolutely. The Online plan gives you a custom program in an app, video form checks and a weekly call." },
  { q: "What if I need to cancel or reschedule?", a: "Just let us know 12 hours before. There are no contracts, so you can pause or change your plan any time." },
];

const marqueeWords = ["STRENGTH", "MOBILITY", "FAT LOSS", "POWER", "ENDURANCE", "REHAB"];

/* Hero white blocks. `content` is text placed on the block (desktop only). */
const blocks = [
  { cls: "left-[0%] top-0 h-full w-[23%] [clip-path:polygon(0_0,25%_0,100%_100%,75%_100%)]" },
  {
    cls: "left-[24%] top-0 h-full w-[10%]",
    content: (
      <span className="m-auto rotate-180 text-[10px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
        Personal training · Est. 2014
      </span>
    ),
  },
  {
    cls: "left-[36%] top-0 h-full w-[21%]",
    content: (
      <p className="mt-auto p-3 text-2xl font-black uppercase leading-[0.9] tracking-[-0.05em] lg:text-4xl">
        No shortcuts.
        <br />
        Just results.
      </p>
    ),
  },
  {
    cls: "right-[14%] top-0 h-[24%] w-[18%]",
    content: (
      <div className="flex h-full flex-col justify-between p-3 text-[11px] font-bold">
        <span>Free intro session</span>
        <a href="#contact" className="pointer-events-auto underline underline-offset-4">
          Book yours ↗
        </a>
      </div>
    ),
  },
  {
    cls: "right-[1%] top-0 h-full w-[10%]",
    content: (
      <span className="m-auto rotate-180 text-[10px] font-black uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
        Strength · Mobility · Fat loss · Power
      </span>
    ),
  },
  { cls: "right-[24%] top-[44%] h-[25%] w-[18%]" },
  { cls: "right-[14%] top-[69%] h-[25%] w-[18%]" },
];

/* =================================================================
   PAGE
   ================================================================= */
function Home() {
  // Which program name is hovered (others dim).
  const [hovered, setHovered] = useState(null);

  // Which FAQ item is open (null = all closed).
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#000000] text-white">

        {/* Header */}
        <Header />

        {/* Main Image */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
          <img
            src={hero}
            alt="Fashion model"
            className="h-full w-120 object-cover object-center"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Left Information */}
        <div className="absolute left-5 top-[30%] z-20 text-[9px] leading-relaxed md:left-10">
          <p>01 / 03</p>

          <div className="mt-5">
            <p>FW 2025, Milan</p>
            <p>
              Directed by —{" "}
              <span className="font-bold">Léon Beaumont</span>
            </p>
          </div>
        </div>

        {/* Right Information */}
        <div className="absolute right-5 top-[34%] z-20 text-right text-[9px] leading-relaxed md:right-10">
          <p>7:30 pm NYC</p>
          <p>Victor Saint — Clair</p>
        </div>

        {/* Designer Names */}
        <div className="absolute right-5 top-[60%] z-20 text-right text-[9px] leading-relaxed md:right-10">
          <p>Orion Zaharov · Sable Corvin · Vesper Mori</p>
          <p>Seraphine Vega · Isolde Ravn</p>
        </div>

        {/* Main Typography */}
        <div className="absolute bottom-[7%] left-160 -translate-x-1/2 z-20">
          <img
            src={herot}
            alt="Fashion model"
            className="h-full w-200  object-cover object-center"
          />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 z-30 flex w-full items-center justify-between px-5 py-5 text-[9px] md:px-10">
          <p>Instagram</p>

          <p className="hidden md:block">
            18 Collection — by 327 Designers, Milan 18 Feb '25
          </p>

          <p>Terms & Conditions</p>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[25%] w-full bg-gradient-to-t
         from-black via-black/60 to-transparent" />

      </section>

      {/* ============================================================
          2. PROGRAMS
          ============================================================ */}
      <section
        id="programs"
        className="relative isolate min-h-[650px] overflow-hidden border-b-[8px] border-black md:min-h-[850px]"
      >
        {/* Black strip behind the names */}
        <div className="absolute left-0 right-0 top-[43%] z-0 h-[42px] -translate-y-1/2 bg-black md:h-[48px]" />

        {/* Stacked program names */}
        <div
          className="absolute left-1/2 top-[90px] z-10 w-[94%] -translate-x-1/2 md:top-[110px] md:w-[65%]"
          onMouseLeave={() => setHovered(null)}
        >
          {programs.map((p, index) => (
            <div
              key={p.name}
              className="relative flex cursor-pointer items-start justify-center"
              style={{ marginTop: index === 0 ? 0 : "-1px" }}
              onMouseEnter={() => setHovered(index)}
            >
              <h2
                className="text-center text-[clamp(2.5rem,8.4vw,5.9rem)] font-black leading-[0.79] tracking-[-0.055em] transition-colors duration-300"
                style={{
                  opacity: hovered === null || hovered === index ? 1 : 0.25,
                  color: hovered === index ? "#DFF500" : "#DFF500",
                }}
              >
                {p.name}
              </h2>
              {/* Small descriptor shown on hover (desktop only) */}
              {hovered === index && (
                <span className="pointer-events-none absolute left-0 top-1/2 text-[#DFF500] hidden -translate-y-1/2 bg-black px-2 py-1 text-[10px] font-bold md:block">
                  {p.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ---- Side content that fills the empty margins (desktop only) ---- */}

        {/* Static "book" badge (top-left) */}
        <a
          href="#contact"
          className="absolute left-[3%] top-[14%] z-20 hidden h-[110px] w-[110px] md:block"
        >
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <defs>
              <path id="badgeCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
            </defs>
            <text className="fill-white" style={{ fontSize: 11, fontWeight: 800 }}>
              <textPath href="#badgeCircle" textLength="285" lengthAdjust="spacing">
                BOOK A FREE SESSION ✦ BOOK A FREE SESSION ✦
              </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-black">↗</span>
        </a>

        {/* Top-right note */}
        <div className="absolute right-[3%] top-[14%] z-20 hidden w-[13%] text-right md:block">
          <p className="text-xs font-bold uppercase">Pick your focus</p>
          <p className="mt-2 text-xs leading-snug opacity-80">
            Nine programs, one coach. Mix and match as your goals change.
          </p>
        </div>

        {/* Bottom-left paragraph */}
        <div className="absolute bottom-[10%] left-[3%] z-20 hidden w-[15%] md:block">
          <p className="text-xs font-bold uppercase">How we start</p>
          <p className="mt-2 text-xs leading-snug opacity-80">
            Every program begins with a movement assessment, so we train what your body needs, not what is trending.
          </p>
        </div>

        {/* Bottom-right list */}
        <div className="absolute bottom-[10%] right-[3%] z-20 hidden w-[14%] text-right md:block">
          <p className="text-xs font-bold uppercase">Session formats</p>
          <ul className="mt-2 space-y-1 text-xs opacity-80">
            <li>In the studio</li>
            <li>Home visits</li>
            <li>Small groups</li>
            <li>Online live</li>
          </ul>
        </div>

        {/* Image 1 – left */}
        <div className="absolute left-[8%] top-[34%] z-20 h-[120px] w-[34%] md:h-[175px] md:w-[29%]">
          <div className="h-full w-full overflow-hidden border border-white">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85"
              alt="Barbell and weights in the gym"
              className="h-full w-full object-cover grayscale hover:grayscale-0"
            />
          </div>
        </div>

        {/* Image 2 – right */}
        <div className="absolute right-[8%] top-[30%] z-20 h-[160px] w-[31%] md:right-[17%] md:top-[29%] md:h-[220px] md:w-[23%]">
          <div className="h-full w-full overflow-hidden border border-white">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85"
              alt="Client training with a coach"
              className="h-full w-full object-cover grayscale hover:grayscale-0"
            />
          </div>
        </div>

        {/* Image 3 – thin strip on the black bar */}
        <div className="absolute right-[1%] top-[43%] z-10 h-[45px] w-[15%] overflow-hidden md:w-[18%]">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=85"
            alt="Workout detail"
            className="h-full w-full object-cover grayscale"
          />
        </div>

        {/* Corner captions */}
        <div className="absolute bottom-4 left-4 z-30 text-[10px] font-bold uppercase tracking-wide">
          Strength · Conditioning · Recovery
        </div>

        <a
          href="#plans"
          className="absolute bottom-4 right-4 z-30 text-[10px] font-bold uppercase tracking-wide"
        >
          See coaching plans ↗
        </a>
      </section>

      {/* ============================================================
          3. ABOUT
          ============================================================ */}

      <section
        id="about"
        className="flex flex-col justify-between gap-8 bg-[#080908] px-4 py-8 text-[#EBEDE3] md:flex-row md:px-8 md:py-12"
      >
        <h2 className="max-w-lg text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-6xl">
          Train beyond
          <br />
          your <span className="text-[#DFF500]">limits.</span>
        </h2>

        <p className="max-w-md text-sm leading-relaxed text-gray-400">
          Certified personal trainer with over a decade of experience helping
          people build strength, lose fat and move without pain. Every plan is
          written for your body, your schedule and your goals.
        </p>

        <a
          href="#contact"
          className="relative w-fit self-start border-b border-[#DFF500] pb-1 text-xs font-bold uppercase text-[#DFF500] transition hover:text-white"
        >
          Book a free intro session ↗
        </a>
      </section>

      {/* ============================================================
          3b. TRAINER FACTS
          ============================================================ */}
      <section className="grid gap-8 border-t border-white/30 px-4 py-10 md:grid-cols-4 md:px-8 md:py-14">
        {facts.map((f) => (
          <div key={f.h}>
            <h3 className="text-xs font-bold uppercase opacity-60">{f.h}</h3>
            <p className="mt-3 text-sm font-semibold  leading-snug">{f.t}</p>
          </div>
        ))}
      </section>


      <section
        id="results"
        className="border-t-[8px] border-black bg-black px-4 py-16 text-[#EBEDE3] md:px-8 md:py-24"
      >
        <div className="grid gap-10 border-b border-white/20 pb-12 md:grid-cols-3 md:pb-16">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col ">
              <p className="text-5xl font-black leading-none tracking-[-0.06em] md:text-9xl text-center">
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-3 text-xs  font-bold uppercase text-center text-[#DFF500]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.who}
              className="relative flex flex-col justify-between gap-8 border-l-2 border-[#DFF500] pl-5"
            >
              <blockquote className="text-xl font-black leading-tight tracking-[-0.03em] md:text-2xl">
                “{t.quote}”
              </blockquote>
              <figcaption className="text-xs font-semibold">
                {t.who}
                <span className="block text-gray-400">{t.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="border-t-[8px] border-black bg-black px-4 py-16 text-[#EBEDE3] md:px-8 md:py-24"
      >
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-6xl">
            Good
            <br />
            questions<span className="text-[#DFF500]">.</span>
          </h2>

          <div>
            {faqs.map((f, i) => {
              const open = openFaq === i;

              return (
                <div key={f.q} className="border-t border-white/20 last:border-b">
                  <button
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-black tracking-[-0.02em] md:text-xl"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                  >
                    {f.q}
                    <span className="text-2xl leading-none text-[#DFF500]">
                      {open ? "×" : "+"}
                    </span>
                  </button>

                  {open && (
                    <p className="max-w-xl pb-5 text-sm leading-relaxed text-gray-400">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. FOOTER / CONTACT
          ============================================================ */}
      <footer id="contact" className="border-t-[8px] border-black bg-[#DFF500] text-black">
        <div className="px-4 py-12 md:px-8 md:py-20">
          <a href="mailto:hello@efit.example" className="block">
            <span className="block text-[18vw] font-black uppercase leading-[0.85] tracking-[-0.07em]">
              Let’s train↗
            </span>
          </a>

          <div className="mt-12 grid gap-8 text-sm font-semibold md:grid-cols-4">
            {[
              { h: "Studio", t: ["E/FIT Training Studio", "Your street address", "City, State"] },
              { h: "Contact", t: ["hello@efit.example", "+91 00000 00000"] },
              { h: "Hours", t: ["Mon – Sat: 6am – 9pm", "Sun: by appointment"] },
              { h: "Follow", t: ["Instagram", "YouTube", "WhatsApp"] },
            ].map((col) => (
              <div key={col.h}>
                <h4 className="mb-3 text-xs font-bold uppercase opacity-60">{col.h}</h4>
                {col.t.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-black/20 pt-4 text-[11px] font-semibold md:flex-row">
            <span>© {new Date().getFullYear()} E/FIT Personal Training. All rights reserved.</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0 });
              }}
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;