"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";

type FingerprintData = {
  side: string;
  finger: string;
  imageUrl: string;
};

type BiometricsResult = {
  passportNumber: string;
  fullName: string;
  status: string;
  biometrics: {
    verified: boolean;
    capturedAt: string | null;
    fingerprints: FingerprintData[];
  };
};

export default function BiometricsStatusPage() {
  const [passportNumber, setPassportNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<BiometricsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) return;

    setErrorMsg(null);
    setResult(null);
    setIsScanning(true);
    setHasScanned(false);

    setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/biometrics-status/${encodeURIComponent(passportNumber.trim())}`
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "No biometrics record found for this passport number.");
        } else {
          setResult(data.record);
        }
      } catch (err) {
        setErrorMsg("Connection error. Please try again later.");
      } finally {
        setIsScanning(false);
        setHasScanned(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <div className="text-center mb-12 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6"
        >
          <Fingerprint className="h-8 w-8 text-rts-blue" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Biometrics Verification Portal
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Check the status of your biometric data submission and view verified fingerprints.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <form onSubmit={handleSearch} className="relative mb-16 group max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-sm group-focus-within:shadow-md transition-shadow duration-300 rounded-3xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="block w-full pl-13 pr-36 py-6 rounded-3xl border border-slate-200 bg-white focus:ring-4 focus:ring-rts-blue/10 focus:border-rts-blue outline-none transition-all placeholder:text-slate-300 uppercase text-lg font-medium shadow-sm"
              placeholder="ENTER PASSPORT NUMBER"
              style={{ paddingLeft: "3.25rem" }}
            />
            <button
              type="submit"
              disabled={isScanning || !passportNumber.trim()}
              className="absolute right-2 px-6 py-3 bg-rts-blue hover:bg-blue-900 text-white font-bold rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center shadow-lg shadow-blue-900/20"
            >
              {isScanning ? <Loader2 className="animate-spin w-5 h-5 mx-2" /> : "Verify Status"}
            </button>
          </div>
        </form>

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rts-blue rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-rts-blue animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse tracking-widest text-xs uppercase">
              Scanning biometric database...
            </p>
          </div>
        )}

        {hasScanned && !isScanning && errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Record Found</h3>
            <p className="text-slate-500">{errorMsg}</p>
          </motion.div>
        )}

        {hasScanned && !isScanning && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
          >
            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-white font-semibold text-lg">Biometric Profile</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                  result.biometrics.verified
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-xl font-bold text-slate-900">{result.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passport Number</p>
                  <p className="text-xl font-mono font-bold text-rts-blue uppercase tracking-tight">
                    {result.passportNumber}
                  </p>
                </div>
              </div>

              {result.biometrics.verified ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      Verified Fingerprint Images
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      Captured: {result.biometrics.capturedAt ? new Date(result.biometrics.capturedAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                    {result.biometrics.fingerprints.map((fp, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 group">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 group-hover:border-rts-blue transition-all shadow-sm bg-slate-100">
                          <img
                            src={fp.imageUrl}
                            alt={`${fp.side} ${fp.finger}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-rts-blue/0 group-hover:bg-rts-blue/10 transition-all pointer-events-none"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-700 uppercase">{fp.finger}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{fp.side} Hand</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Verification Pending</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">
                    Your biometric data is currently being processed. Please check back in 24-48 hours.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
