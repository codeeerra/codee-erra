"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import {
  FiGrid, FiImage, FiHome, FiBox, FiRadio, FiClock,
  FiInfo, FiMail, FiSettings, FiLogOut, FiMenu, FiX
} from "react-icons/fi";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
  { label: "Logo", href: "/admin/dashboard/logo", icon: FiImage },
  { label: "Home Content", href: "/admin/dashboard/home", icon: FiHome },
  { label: "Products", href: "/admin/dashboard/products", icon: FiBox },
  { label: "Latest News", href: "/admin/dashboard/news", icon: FiRadio },
  { label: "Upcoming", href: "/admin/dashboard/upcoming", icon: FiClock },
  { label: "About Page", href: "/admin/dashboard/about", icon: FiInfo },
  { label: "Inquiries", href: "/admin/dashboard/inquiries", icon: FiMail },
  { label: "Settings", href: "/admin/dashboard/settings", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-cyan-500/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden neon-border">
            <Image src="/logo.jpeg" alt="codee.erra" fill className="object-cover" />
          </div>
          <div>
            <div className="font-display text-sm font-bold gradient-text tracking-widest">codee.erra</div>
            <div className="text-text-secondary text-xs font-body">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <span className="text-accent-cyan text-xs font-display font-bold">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <div>
            <div className="text-white text-xs font-body truncate max-w-[140px]">{user?.email}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-body">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-body group ${
                active
                  ? "bg-cyan-500/15 text-accent-cyan border border-cyan-500/30 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} className={active ? "text-accent-cyan" : "group-hover:text-white"} />
              <span className="tracking-wide">{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-cyan-500/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-body text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <FiLogOut size={16} />
          <span className="tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 h-screen glass-dark border-r border-cyan-500/10 fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg neon-border"
      >
        {mobileOpen ? <FiX size={20} className="text-accent-cyan" /> : <FiMenu size={20} className="text-accent-cyan" />}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 glass-dark border-r border-cyan-500/10 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
