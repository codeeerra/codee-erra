"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { addInquiry } from "@/firebase/services";
import toast from "react-hot-toast";
import { FiX, FiSend, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";



const INQUIRY_TYPES = [
  { value: "purchase", label: "Purchase Product" },
 
  { value: "demo", label: "Demo Request" },
  { value: "custom", label: "Custom Development" },
];

interface Props {
  productName?: string;
  onClose: () => void;
}

export default function InquiryForm({ productName = "", onClose }: Props) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    productName: productName, inquiryType: "purchase" as const,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));
const handleSubmit = async () => {
  if (!form.fullName || !form.email || !form.message) {
    toast.error("Please fill required fields");
    return;
  }

  setLoading(true);

  try {
  await emailjs.send(
    "service_gaxaoy3",
    "template_h93ir69",
    {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      product: form.productName,
      inquiry_type: form.inquiryType,
      message: form.message,
    },
    "T-7Hz_NDdn-_PzAqv"
  );

    toast.success("Inquiry sent successfully!");

    setForm({
      fullName: "",
      email: "",
      phone: "",
      productName: productName,
      inquiryType: "purchase",
      message: "",
    });

    onClose();

  } catch (error) {
    console.error(error);
    toast.error("Failed to send inquiry");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto neon-border relative"
      >
        {/* Header */}
        <div className="sticky top-0 glass-dark border-b border-cyan-500/10 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold gradient-text">Get In Touch</h2>
            {productName && <p className="text-text-secondary text-xs font-body mt-1">Re: {productName}</p>}
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-white p-2 rounded transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto mb-6">
              <FiSend size={32} className="text-accent-cyan" />
            </motion.div>
            <h3 className="font-display text-xl font-bold text-white mb-3">Inquiry Sent!</h3>
            <p className="text-text-secondary font-body">We'll get back to you within 24 hours. Our team is excited to connect with you.</p>
            <button onClick={onClose} className="mt-8 neon-btn-filled px-8 py-3 rounded font-display text-sm tracking-widest">
              CLOSE
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">FULL NAME *</label>
                <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                  className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">EMAIL *</label>
                <input value={form.email} onChange={(e) => set("email", e.target.value)}
                  className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="john@company.com" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">PHONE</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="+1 (555) 000-0000" />
              </div>
                           
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">PRODUCT</label>
                <input value={form.productName} onChange={(e) => set("productName", e.target.value)}
                  className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="Product name" />
              </div>
            
            </div>

            {/* Inquiry Type */}
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-3">INQUIRY TYPE</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INQUIRY_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => set("inquiryType", t.value)}
                    className={`py-2 px-3 rounded-lg text-xs font-display tracking-wider transition-all border ${
                      form.inquiryType === t.value
                        ? "bg-cyan-500/20 border-accent-cyan text-accent-cyan"
                        : "border-cyan-500/20 text-text-secondary hover:border-cyan-500/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">MESSAGE *</label>
              <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4}
                className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm resize-none"
                placeholder="Tell us about your project, goals, and timeline..." />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 neon-btn-filled py-4 rounded-lg font-display text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
                    <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
                    <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
                  </>
                ) : (
                  <><FiSend size={14} /> SEND INQUIRY</>
                )}
              </button>
              
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
