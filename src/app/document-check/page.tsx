"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  FileText,
  ShieldCheck,
  AlertCircle,
  User,
  CheckCircle2,
  Download,
  FileDown,
  PartyPopper,
} from "lucide-react";

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

type ApplicationDetails = {
  passportNumber: string;
  fullName: string;
  status: string;
  documents: Document[];
  applicationData: {
    email: string;
    phone: string;
    nationality: string;
    dob: string;
    passportExpiry: string;
    address: string;
  };
};

export default function DocumentCheckPage() {
  const [passportNumber, setPassportNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [result, setResult] = useState<ApplicationDetails | null>(null);
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
          `/api/status/${encodeURIComponent(passportNumber.trim())}`
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || "No application record found for this passport number.");
        } else {
          // Enhancing the mock data returned from the existing status API to include application details
          const app = data.application;
          setResult({
            ...app,
            applicationData: {
              email: "applicant@example.com",
              phone: "+1 234 567 890",
              nationality: "United States",
              dob: "1990-01-01",
              passportExpiry: "2030-12-31",
              address: "123 Maple St, Springfield, USA",
            },
          });
        }
      } catch (err) {
        setErrorMsg("Connection error. Please try again later.");
      } finally {
        setIsScanning(false);
        setHasScanned(true);
      }
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-sans">
      <div className="text-center mb-12 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6"
        >
          <FileText className="h-8 w-8 text-rts-blue" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Document Verification Center
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Review your submitted application details and download official documents issued by the admin.
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
              {isScanning ? <Loader2 className="animate-spin w-5 h-5 mx-2" /> : "Verify Documents"}
            </button>
          </div>
        </form>

        {isScanning && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rts-blue rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-rts-blue animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse tracking-widest text-xs uppercase">
              Retrieving encrypted documents...
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
            {result.status.toLowerCase() === "approved" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-emerald-50 border-b border-emerald-100 px-8 py-6 flex items-center gap-4"
              >
                <div className="p-2 bg-emerald-100 rounded-full">
                  <PartyPopper className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-emerald-800 font-bold text-lg">Congratulations!</h3>
                  <p className="text-emerald-600 text-sm">Your visa has been approved. You can now download your official documents below.</p>
                </div>
              </motion.div>
            )}

            <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="text-white font-semibold text-lg">Application Details</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(result.status)}`}
              >
                {result.status}
              </span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="w-5 h-5 text-slate-400" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Full Name</span>
                      <span className="text-sm font-bold text-slate-900">{result.fullName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Passport Number</span>
                      <span className="text-sm font-bold text-rts-blue">{result.passportNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Nationality</span>
                      <span className="text-sm font-bold text-slate-900">{result.applicationData.nationality}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Date of Birth</span>
                      <span className="text-sm font-bold text-slate-900">{result.applicationData.dob}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                    Contact & Travel
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Email Address</span>
                      <span className="text-sm font-bold text-slate-900">{result.applicationData.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Phone Number</span>
                      <span className="text-sm font-bold text-slate-900">{result.applicationData.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Passport Expiry</span>
                      <span className="text-sm font-bold text-slate-900">{result.applicationData.passportExpiry}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-400 font-medium">Address</span>
                      <span className="text-sm font-bold text-slate-900 text-right max-w-[150px] leading-tight">{result.applicationData.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-slate-400" />
                  Official Admin Documents
                </h4>

                {result.documents && result.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {result.documents.map((doc) => (
                      <a
                        key={doc.id}
                        enclassName="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group hover:border-rts-blue/30"
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all group hover:border-rts-blue/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:border-rts-blue/30">
                            <FileDown className="w-4 h-4 text-slate-400 group-hover:text-rts-blue" />
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {doc.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-rts-blue group-hover:translate-x-1 transition-transform">
                          Download <Download className="w-4 h-4" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">
                      No official documents have been issued yet.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Check back later or contact the visa office.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
