"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Home as HomeIcon,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Data ─── */
const visaCategories = [
  {
    icon: Briefcase,
    title: "Job Visa",
    desc: "Secure skilled worker and employment-based visas to build your career in Australia.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Building2,
    title: "Business Visa",
    desc: "Establish or expand your business presence with our expert business migration support.",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    icon: Globe,
    title: "Diplomatic Visa",
    desc: "Specialized visa services for diplomats, consular officers and government officials.",
    color: "from-violet-500 to-violet-700",
  },
  {
    icon: GraduationCap,
    title: "Student Visa",
    desc: "Study at world-class Australian universities with our streamlined student visa process.",
    color: "from-sky-500 to-sky-700",
  },
  {
    icon: HomeIcon,
    title: "Residence Visa",
    desc: "Achieve permanent residency and make Australia your forever home.",
    color: "from-teal-500 to-teal-700",
  },
  {
    icon: Plane,
    title: "Tourist Visa",
    desc: "Explore Australia's breathtaking landscapes with a hassle-free tourist visa.",
    color: "from-emerald-500 to-emerald-700",
  },
];

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Secure Data Handling",
    desc: "Enterprise-grade encryption protects every document and personal detail you share with us.",
  },
  {
    icon: Zap,
    title: "Fast-Track Processing",
    desc: "Dedicated case managers and priority channels to get your visa processed faster than standard.",
  },
  {
    icon: Clock,
    title: "24/7 Expert Support",
    desc: "Round-the-clock access to certified migration consultants — whenever you need guidance.",
  },
  {
    icon: Award,
    title: "Certified Consultants",
    desc: "All our agents are MARA-registered with decades of combined Australian immigration experience.",
  },
];

const countries = [
  {
    name: "Australia",
    flag: "🇦🇺",
    featured: true,
    desc: "Primary destination",
  },
  { name: "Canada", flag: "🇨🇦", featured: false, desc: "Work & Study" },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    featured: false,
    desc: "Skilled Migration",
  },
  { name: "USA", flag: "🇺🇸", featured: false, desc: "Business & Tourism" },
  {
    name: "New Zealand",
    flag: "🇳🇿",
    featured: false,
    desc: "Residence & Work",
  },
];

const testimonials = [
  {
    name: "Sarah Mohammed",
    location: "Dubai → Melbourne",
    visa: "Skilled Worker Visa",
    quote:
      "RTS Australia made the impossible feel effortless. From the first consultation to the day I landed in Melbourne, the team was beside me every step of the way.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "James Okoro",
    location: "Lagos → Sydney",
    visa: "Student Visa",
    quote:
      "I had been rejected twice before I found RTS Australia. Their deep expertise in student visas turned everything around. I am now enrolled at UNSW and loving it!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Mumbai → Brisbane",
    visa: "Business Visa",
    quote:
      "Professional, responsive, and incredibly knowledgeable. My business visa was approved in record time. RTS Australia is in a league of their own.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    name: "David Chen",
    location: "Beijing → Perth",
    visa: "Residence Visa",
    quote:
      "After 3 years of waiting, RTS Australia helped me achieve permanent residency in just 8 months. Their connections and expertise are unmatched in the industry.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
];

/* ─── Section Wrapper ─── */
function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredVisa, setHoveredVisa] = useState<number | null>(null);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&q=85&fit=crop"
            alt="Sydney Opera House aerial view"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/95 via-[#003366]/80 to-[#003366]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Australia&apos;s Most Trusted Migration Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Your Australian
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Dream Starts Here.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/80 mb-10 leading-relaxed"
            >
              Expert visa and migration services backed by 20+ years of
              experience, a 99% success rate, and MARA-certified consultants
              guiding you every step.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/apply"
                id="hero-apply-now"
                className="group inline-flex items-center justify-center gap-2 bg-rts-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-700/50 hover:scale-105 text-base"
              >
                Start Your Application
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/check-visa"
                id="hero-check-visa"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-base"
              >
                Check Visa Status
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-linear-to-b from-white/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          STATS FLOATING CARD
      ══════════════════════════════════════ */}
      <section className="bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="-mt-12 bg-white rounded-2xl shadow-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100"
          >
            {[
              {
                value: "99%",
                label: "Success Rate",
                icon: CheckCircle,
                color: "text-green-500",
              },
              {
                value: "20+",
                label: "Years Experience",
                icon: Award,
                color: "text-rts-blue",
              },
              {
                value: "15k+",
                label: "Visas Processed",
                icon: Globe,
                color: "text-rts-red",
              },
              {
                value: "24/7",
                label: "Expert Support",
                icon: Clock,
                color: "text-indigo-500",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-1`} />
                <div
                  className="text-3xl md:text-4xl font-black text-gray-900"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION A: ABOUT
      ══════════════════════════════════════ */}
      <section id="about" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fit=crop"
                  alt="Professional migration consultation meeting"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-rts-blue/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 max-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rts-blue flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Verified
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      Migration Experts
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">5.0 Rating</span>
                </div>
              </motion.div>

              {/* Experience pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-6 -left-6 bg-rts-red rounded-2xl shadow-xl p-4 text-white text-center"
              >
                <div
                  className="text-3xl font-black"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  20+
                </div>
                <div className="text-xs font-semibold opacity-90">
                  Years of
                  <br />
                  Excellence
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <SectionReveal>
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-rts-blue" />
                <span className="text-rts-blue text-sm font-semibold">
                  About RTS Australia
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Trusted Partners in Your{" "}
                <span className="text-rts-blue">Australian Journey.</span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 text-lg leading-relaxed mb-8"
              >
                For over two decades, RTS Australia has been the trusted bridge
                between aspiring migrants and their Australian dream. Our
                MARA-certified consultants bring an unrivalled depth of
                expertise across every visa category, delivering a seamless,
                transparent, and high-success migration experience.
              </motion.p>

              <motion.div variants={stagger} className="space-y-4 mb-10">
                {[
                  "MARA Registered Migration Agents",
                  "99% Visa Approval Success Rate",
                  "Personalised case management from day one",
                  "Transparent pricing — no hidden fees",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 bg-rts-blue hover:bg-rts-blue-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-900/20"
                >
                  Book a Free Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION B: VISA CATEGORIES
      ══════════════════════════════════════ */}
      <section id="services" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionReveal className="text-center mb-16">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-rts-red" />
              <span className="text-rts-red text-sm font-semibold">
                Visa Categories
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Find Your Perfect <span className="text-rts-blue">Visa</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-lg max-w-2xl mx-auto"
            >
              From skilled work visas to student pathways — we cover every route
              to Australia.
            </motion.p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visaCategories.map((cat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onHoverStart={() => setHoveredVisa(i)}
                onHoverEnd={() => setHoveredVisa(null)}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-rts-red/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-rts-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl" />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <cat.icon className="w-7 h-7 text-white" />
                </div>

                <h3
                  className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rts-blue transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {cat.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {cat.desc}
                </p>

                <div className="flex items-center gap-2 text-rts-blue group-hover:text-rts-red transition-colors">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION C: WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className="py-28 bg-rts-blue relative overflow-hidden">
        {/* subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <SectionReveal className="text-center mb-16">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-rts-red" />
              <span className="text-white/90 text-sm font-semibold">
                Why Choose RTS Australia
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              The RTS <span className="text-red-400">Advantage</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              We combine decades of expertise with modern tools to deliver an
              exceptional migration experience.
            </motion.p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/15 rounded-2xl p-8 text-center transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-rts-red/20 group-hover:bg-rts-red/40 flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                  <item.icon
                    className="w-7 h-7 text-red-400 group-hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION D: COUNTRIES
      ══════════════════════════════════════ */}
      <section id="countries" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionReveal className="text-center mb-16">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6"
            >
              <Globe className="w-4 h-4 text-rts-blue" />
              <span className="text-rts-blue text-sm font-semibold">
                Global Reach
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Countries We <span className="text-rts-blue">Serve</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-lg max-w-2xl mx-auto"
            >
              Specialised migration pathways across five English-speaking
              destinations.
            </motion.p>
          </SectionReveal>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {countries.map((country, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, transition: { duration: 0.25 } }}
                className={`group relative flex flex-col items-center gap-4 cursor-pointer ${country.featured ? "order-first" : ""}`}
              >
                <div
                  className={`relative flex items-center justify-center rounded-full shadow-lg transition-all duration-400
                  ${
                    country.featured
                      ? "w-36 h-36 bg-linear-to-br from-rts-blue to-rts-blue-light ring-4 ring-rts-red/30 group-hover:ring-rts-red shadow-rts-blue/30"
                      : "w-28 h-28 bg-gray-100 grayscale group-hover:grayscale-0 group-hover:shadow-rts-red/20 group-hover:ring-2 group-hover:ring-rts-red/50"
                  } overflow-hidden`}
                >
                  <span className="text-5xl md:text-6xl">{country.flag}</span>
                  {country.featured && (
                    <div className="absolute -top-1 -right-1 bg-rts-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={`font-bold text-base ${country.featured ? "text-rts-blue" : "text-gray-700 group-hover:text-rts-blue"} transition-colors`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {country.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {country.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION E: TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-28 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionReveal className="text-center mb-16">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-full px-4 py-2 mb-6"
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              <span className="text-yellow-700 text-sm font-semibold">
                Client Success Stories
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Real People. <span className="text-rts-blue">Real Results.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-lg max-w-2xl mx-auto"
            >
              Thousands of families have trusted RTS Australia to make their
              migration dreams a reality.
            </motion.p>
          </SectionReveal>

          {/* Testimonial Carousel */}
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center relative overflow-hidden"
              >
                {/* Large quote mark */}
                <div className="absolute top-4 left-8 text-8xl text-gray-100 font-serif leading-none select-none"></div>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ),
                  )}
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-lg leading-relaxed italic mb-8 relative z-10">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>

                {/* Avatar & Info */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Image
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold text-gray-900 text-base"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonials[activeTestimonial].location}
                    </div>
                    <div className="inline-block mt-2 bg-rts-blue/10 text-rts-blue text-xs font-semibold px-3 py-1 rounded-full">
                      ✓ {testimonials[activeTestimonial].visa}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                id="prev-testimonial"
                onClick={() =>
                  setActiveTestimonial(
                    (p) => (p - 1 + testimonials.length) % testimonials.length,
                  )
                }
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-rts-blue hover:bg-rts-blue hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === activeTestimonial
                        ? "w-8 h-2 bg-rts-blue"
                        : "w-2 h-2 bg-gray-200 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <button
                id="next-testimonial"
                onClick={() =>
                  setActiveTestimonial((p) => (p + 1) % testimonials.length)
                }
                className="w-10 h-10 rounded-full border border-gray-200 hover:border-rts-blue hover:bg-rts-blue hover:text-white text-gray-400 flex items-center justify-center transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Client logos strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-8 opacity-40"
          >
            {[
              "15,000+",
              "Approved Visas",
              "•",
              "20+",
              "Years",
              "•",
              "5★",
              "Average Rating",
              "•",
              "100%",
              "MARA Certified",
            ].map((item, i) => (
              <span key={i} className="text-gray-500 font-semibold text-sm">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="py-20 bg-rts-red relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_right,white,transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Ready to Start Your Australian Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/80 text-lg mb-10 max-w-2xl mx-auto"
          >
            Book your free consultation today and take the first step toward
            your new life in Australia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/apply"
              id="cta-apply"
              className="inline-flex items-center justify-center gap-2 bg-white text-rts-red font-black py-4 px-10 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:scale-105 text-base"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/check-visa"
              id="cta-check"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 text-base"
            >
              Check Your Visa Status
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer id="contact" className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <Image
                src="/logo.png"
                alt="RTS Australia"
                width={160}
                height={50}
                className="object-contain h-12 w-auto mb-6  invert"
              />
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Australia&apos;s premier visa and migration services agency,
                helping thousands achieve their Australian dream since 2004.
              </p>
              <div className="flex gap-3">
                {["facebook", "twitter", "linkedin", "instagram"].map((s) => (
                  <div
                    key={s}
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-rts-red flex items-center justify-center cursor-pointer transition-colors duration-200 text-xs font-bold"
                  >
                    {s[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Services
              </h4>
              <ul className="space-y-3">
                {visaCategories.map((v) => (
                  <li key={v.title}>
                    <Link
                      href="/apply"
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-rts-red inline-block" />
                      {v.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Our Team",
                  "Success Stories",
                  "Blog",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-rts-red inline-block" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rts-red shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">
                    Level 12, 680 George Street,
                    <br />
                    Sydney NSW 2000, Australia
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-rts-red shrink-0" />
                  <a
                    href="tel:+61299999999"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    +61 2 9999 9999
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-rts-red shrink-0" />
                  <a
                    href="mailto:info@rtsaustralia.com.au"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    info@rtsaustralia.com.au
                  </a>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-sm font-semibold">
                    We&apos;re Online
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  Mon–Fri 9am–6pm AEST
                  <br />
                  Weekend support available
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} RTS Australia. All rights
                reserved. MARA registration: 00000000.
              </p>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-rts-blue text-[10px] uppercase tracking-widest transition-colors">
                Admin Portal
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-sm">
                Trusted by 15,000+ clients worldwide
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
