"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, CheckCircle, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Countries", href: "#countries" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-white/95 backdrop-blur-md border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="RTS Australia – Visa & Migration Services"
                  width={180}
                  height={55}
                  className="object-contain h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-gray-700 hover:text-rts-blue font-medium text-sm tracking-wide transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rts-red group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex flex-row items-center space-x-3">
              <Link
                href="/check-visa"
                className="flex items-center text-sm font-semibold text-gray-700 hover:text-rts-blue bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-200 hover:border-rts-blue"
              >
                <FileText className="w-4 h-4 mr-2" />
                Biometrics Status
              </Link>

              <Link
                href="/check-visa"
                className="flex items-center text-sm font-semibold text-rts-blue bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 border border-blue-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Check Visa
              </Link>

              <Link
                href="/apply"
                className="flex items-center text-sm font-bold text-white bg-rts-red hover:bg-rts-red-dark px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-red-200 hover:shadow-lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply Now
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-rts-blue hover:bg-gray-100 transition-all"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-gray-200 shadow-lg sticky top-20 z-40 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-700 hover:text-rts-blue font-medium text-base py-2 border-b border-gray-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col space-y-3">
                <Link href="/check-visa" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
                  <FileText className="w-4 h-4 mr-2" /> Biometrics Status
                </Link>
                <Link href="/check-visa" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center text-sm font-semibold text-rts-blue bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
                  <Search className="w-4 h-4 mr-2" /> Check Visa
                </Link>
                <Link href="/apply" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center text-sm font-bold text-white bg-rts-red px-4 py-3 rounded-lg shadow">
                  <CheckCircle className="w-4 h-4 mr-2" /> Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
