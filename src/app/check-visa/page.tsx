"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileDown,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type ApplicationResult = {
  passportNumber: string;
  fullName: string;
  status: string;
  documents: Document[];
};

export default function CheckVisaPage() {
  const [passportNumber, setPassportNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passportNumber.trim()) return;

    setErrorMsg(null);
    setResult(null);
    setIsScanning(true);
    setHasScanned(false);

    // Play scanning sound
    try {
      const audio = new Audio("/scanning.mp3"); // We assume scanning.mp3 placeholder is in public
      audio.volume = 0.5;
      audio.play().catch(() => {
        console.warn("Sound playback prevented by browser or missing file.");
      });
    } catch {
      // Ignore audio errors quietly
    }

    // 2-second artificial delay to build anticipation
    setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/status/${encodeURIComponent(passportNumber.trim())}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "Record not found");
        } else {
          setResult(data.application);
        }
      } catch (err) {
        setErrorMsg("Failed to connect to the database.");
        console.log(err);
      } finally {
        setIsScanning(false);
        setHasScanned(true);
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "biometrics pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"; // Applied
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl font-extrabold text-rts-blue mb-4">
          Visa & Biometrics Status
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your Passport Number below to check your current application
          status securely.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <form
          onSubmit={handleSearch}
          className="relative mb-12 flex items-center"
        >
          <div className="relative grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ShieldCheck className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="block w-full pl-12 pr-32 py-5 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400 uppercase text-lg font-semibold shadow-sm"
              placeholder="ENTER PASSPORT NO."
            />
          </div>
          <button
            type="submit"
            disabled={isScanning || !passportNumber.trim()}
            className="absolute right-2 px-6 py-3 bg-rts-blue hover:bg-blue-900 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {isScanning ? (
              <Loader2 className="animate-spin w-5 h-5 mx-2" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" /> Scan
              </>
            )}
          </button>
        </form>

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rts-blue rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-rts-blue animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-rts-blue font-semibold animate-pulse tracking-widest text-sm">
              SCANNING SECURE DATABASE...
            </p>
          </div>
        )}

        {hasScanned && !isScanning && errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-sm"
          >
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 mb-1">
              No Record Found
            </h3>
            <p className="text-red-700">{errorMsg}</p>
          </motion.div>
        )}

        {hasScanned && !isScanning && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="bg-rts-blue px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">
                Applicant Profile
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(result.status)}`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {result.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Passport Number</p>
                  <p className="font-bold text-rts-blue text-lg uppercase tracking-wider">
                    {result.passportNumber}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                  <FileDown className="w-5 h-5 mr-2 text-gray-500" /> Secure
                  Documents
                </h4>

                {result.documents && result.documents.length > 0 ? (
                  <div className="space-y-3">
                    {result.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                      >
                        <span className="font-medium text-gray-700 group-hover:text-rts-blue">
                          {doc.fileName}
                        </span>
                        <FileDown className="w-5 h-5 text-gray-400 group-hover:text-rts-blue" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center text-sm border border-dashed border-gray-300">
                    No documents have been uploaded for this application yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
