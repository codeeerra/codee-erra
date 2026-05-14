"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiRadio, FiBox, FiClock, FiArrowRight } from "react-icons/fi";

const SECTIONS = [
  { title: "Latest News", desc: "Add, edit, or remove news items shown on the homepage", href: "/admin/dashboard/news", icon: FiRadio },
  { title: "Products", desc: "Manage product listings with images, tags, and descriptions", href: "/admin/dashboard/products", icon: FiBox },
  { title: "Upcoming Projects", desc: "Update the roadmap and upcoming innovation timeline", href: "/admin/dashboard/upcoming", icon: FiClock },
];

export default function HomeContentAdminPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Home Content</h1>
        <p className="text-text-secondary font-body mt-1">Control all content displayed on the main landing page</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
        {SECTIONS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Link href={s.href} className="glass rounded-xl p-6 neon-border flex items-center justify-between group hover:border-cyan-500/50 transition-all block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <s.icon size={20} className="text-accent-cyan" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{s.title}</h3>
                  <p className="text-text-secondary font-body text-sm mt-0.5">{s.desc}</p>
                </div>
              </div>
              <FiArrowRight className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" size={18} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
