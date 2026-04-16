"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, FileText, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    passportNumber: "",
    visaType: "Tourist (Subclass 600)",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit application");
      } else {
        toast.success("Application submitted successfully!");
        setSuccess(true);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-green-500"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received</h2>
          <p className="text-gray-600 mb-8">
            Your application under passport number <span className="font-semibold">{formData.passportNumber}</span> has been securely lodged. You will be notified of any status updates.
          </p>
          <a href="/check-visa" className="inline-flex items-center text-rts-blue font-semibold hover:text-blue-800 transition-colors">
            Track Status <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Information Side */}
        <div className="pt-8 lg:sticky lg:top-24">
          <FileText className="w-12 h-12 text-rts-blue mb-6" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Secure Application Portal</h1>
          <p className="text-lg text-gray-600 mb-8">
            Begin your migration journey with RTS Australia. Enter your details as they exactly appear on your passport to ensure streamlined processing.
          </p>
          
          <div className="space-y-6">
            <div className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 pl-4 border-l-4 border-l-rts-blue">
              <div>
                <h3 className="font-bold text-gray-900">Data Security</h3>
                <p className="text-sm text-gray-500 mt-1">All entries are encrypted and mapped directly to your Passport Number.</p>
              </div>
            </div>
            <div className="flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 pl-4 border-l-4 border-l-rts-red">
              <div>
                <h3 className="font-bold text-gray-900">One Passport, One Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Our system prevents duplicate filings to ensure total compliance and priority processing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (As per Passport)</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number <span className="text-rts-red">*</span></label>
                <input
                  type="text"
                  name="passportNumber"
                  required
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400 uppercase"
                  placeholder="A1234567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400"
                  placeholder="+61 400 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
              <select
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all bg-white"
              >
                <option value="Tourist (Subclass 600)">Tourist (Subclass 600)</option>
                <option value="Student (Subclass 500)">Student (Subclass 500)</option>
                <option value="Skilled Independent (Subclass 189)">Skilled Independent (Subclass 189)</option>
                <option value="Temporary Skill Shortage (Subclass 482)">Temporary Skill Shortage (Subclass 482)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message / Additional Details (Optional)</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rts-blue focus:border-rts-blue outline-none transition-all placeholder:text-gray-400 resize-none"
                placeholder="Any specific questions or concerns?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rts-blue hover:bg-blue-900 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5" /> Processing...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
