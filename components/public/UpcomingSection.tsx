"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUpcomingProjects } from "@/firebase/services";
import { UpcomingProject } from "@/types";



const STATUS_CONFIG = {
  planning: { label: "PLANNING", color: "#94A3B8", bg: "bg-slate-500/20 border-slate-500/30" },
  development: { label: "IN DEV", color: "#00D9FF", bg: "bg-cyan-500/20 border-cyan-500/30" },
  testing: { label: "TESTING", color: "#F59E0B", bg: "bg-amber-500/20 border-amber-500/30" },
  launch: { label: "LAUNCHING", color: "#10B981", bg: "bg-emerald-500/20 border-emerald-500/30" },
};

export default function UpcomingSection() {
  const [projects, setProjects] = useState<UpcomingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingProjects()
      .then((d) => setProjects(d))
.catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="upcoming" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,217,255,0.04),transparent_70%)]" />
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-accent-cyan font-display text-xs tracking-widest mb-4">
            ROADMAP
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Upcoming <span className="gradient-text">Innovation</span>
          </h2>
          <p className="mt-4 text-text-secondary font-body text-lg max-w-xl mx-auto">
            A glimpse into what we're building next — the future is already in motion.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-3 py-12">
            {[0, 1, 2].map((i) => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />

            <div className="space-y-12">
              {projects.map((project, i) => {
                const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning;
                const isRight = i % 2 === 0;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex items-center gap-6 md:gap-0 ${isRight ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Card */}
                    <div className={`ml-16 md:ml-0 md:w-[45%] ${isRight ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"}`}>
                      <div className="glass rounded-xl p-6 neon-border product-card">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-display tracking-widest mb-3 border ${cfg.bg}`} style={{ color: cfg.color }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
                          {cfg.label}
                        </div>
                        <h3 className="font-display text-sm font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-text-secondary font-body text-sm leading-relaxed">{project.description}</p>
                      </div>
                    </div>

                    {/* Dot on timeline */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-accent-cyan bg-bg-primary"
                      style={{ boxShadow: `0 0 12px ${cfg.color}` }} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
