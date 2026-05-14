"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProducts, getNews, getUpcomingProjects, getInquiries } from "@/firebase/services";
import { FiBox, FiRadio, FiClock, FiMail, FiArrowRight, FiActivity } from "react-icons/fi";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, news: 0, upcoming: 0, inquiries: 0, newInquiries: 0 });

  useEffect(() => {
    Promise.all([getProducts(), getNews(), getUpcomingProjects(), getInquiries()])
      .then(([p, n, u, i]) => {
        setStats({
          products: p.length,
          news: n.length,
          upcoming: u.length,
          inquiries: i.length,
          newInquiries: i.filter((x) => x.status === "new").length,
        });
      })
      .catch(() => {});
  }, []);

  const CARDS = [
    { label: "Products", value: stats.products, icon: FiBox, href: "/admin/dashboard/products", color: "cyan" },
    { label: "News Items", value: stats.news, icon: FiRadio, href: "/admin/dashboard/news", color: "blue" },
    { label: "Upcoming Projects", value: stats.upcoming, icon: FiClock, href: "/admin/dashboard/upcoming", color: "violet" },
    { label: "Total Inquiries", value: stats.inquiries, icon: FiMail, href: "/admin/dashboard/inquiries", color: "emerald", badge: stats.newInquiries },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <FiActivity className="text-accent-cyan" size={20} />
          <span className="font-display text-xs tracking-widest text-text-secondary">OVERVIEW</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white">
          Welcome to <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-text-secondary font-body mt-2">Manage all content, products and inquiries from here.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="block glass rounded-xl p-6 neon-border product-card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <card.icon size={18} className="text-accent-cyan" />
                </div>
                {card.badge ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-display">
                    {card.badge} NEW
                  </span>
                ) : null}
              </div>
              <div className="font-display text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-text-secondary font-body text-sm">{card.label}</div>
              <div className="flex items-center gap-1 mt-3 text-accent-cyan text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                MANAGE <FiArrowRight size={10} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="font-display text-sm tracking-widest text-text-secondary mb-4">QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Add Product", href: "/admin/dashboard/products", desc: "Publish a new product" },
            { label: "Post News", href: "/admin/dashboard/news", desc: "Share latest updates" },
            { label: "Add Upcoming", href: "/admin/dashboard/upcoming", desc: "Add roadmap item" },
            { label: "View Inquiries", href: "/admin/dashboard/inquiries", desc: "Check new messages" },
            { label: "Edit About", href: "/admin/dashboard/about", desc: "Update company story" },
            { label: "Logo Settings", href: "/admin/dashboard/logo", desc: "Manage brand assets" },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="glass rounded-lg p-4 neon-border group flex items-center justify-between hover:border-cyan-500/50 transition-all"
            >
              <div>
                <div className="font-display text-sm font-bold text-white group-hover:text-accent-cyan transition-colors">{action.label}</div>
                <div className="text-text-secondary text-xs font-body mt-0.5">{action.desc}</div>
              </div>
              <FiArrowRight className="text-text-secondary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" size={16} />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
