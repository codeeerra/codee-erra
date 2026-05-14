"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/admin/dashboard");
  }, [user, router]);

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Access granted");
      router.push("/admin/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.05),transparent_70%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-dark rounded-2xl p-10 w-full max-w-md neon-border relative"
      >
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-scan" />
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden neon-border mx-auto mb-4 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
            <Image src="/logo.jpeg" alt="codee.erra" fill className="object-cover" />
          </div>
          <h1 className="font-display text-xl font-bold gradient-text tracking-widest">codee.erra</h1>
          <p className="text-text-secondary font-body text-sm mt-2 tracking-widest">ADMIN ACCESS</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cyan-500/30" />
          <span className="text-text-secondary text-xs font-display tracking-widest">SECURE LOGIN</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cyan-500/30" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">EMAIL</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-cyan" size={16} />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full cyber-input rounded-lg pl-11 pr-4 py-4 font-body text-sm"
                placeholder="admin@codee.erra"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">PASSWORD</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-cyan" size={16} />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full cyber-input rounded-lg pl-11 pr-4 py-4 font-body text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full neon-btn-filled py-4 rounded-lg font-display text-sm tracking-widest mt-8 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
              <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
              <div className="loading-dot w-2 h-2 rounded-full bg-bg-primary" />
            </>
          ) : (
            <><FiLogIn size={16} /> ACCESS DASHBOARD</>
          )}
        </button>

        <p className="text-center text-text-secondary font-body text-xs mt-6">
          Protected system. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
}
