"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-4">RTS Australia</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Premium Visa & Migration Services providing professional guidance
            for your journey to Australia. MARA certified consultants.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</Link></li>
            <li><Link href="/apply" className="text-slate-400 hover:text-white transition-colors text-sm">Apply Now</Link></li>
            <li><Link href="/check-visa" className="text-slate-400 hover:text-white transition-colors text-sm">Check Visa</Link></li>
            <li><Link href="/document-check" className="text-slate-400 hover:text-white transition-colors text-sm">Document Check</Link></li>
            <li><Link href="/biometrics-status" className="text-slate-400 hover:text-white transition-colors text-sm">Biometrics Status</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Administration</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm">
                Admin Portal
                <span className="ml-2 text-[10px] bg-slate-800 px-1 rounded border border-slate-700">Secure</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} RTS Australia. All rights reserved.
      </div>
    </footer>
  );
}
