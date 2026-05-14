"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getNews } from "@/firebase/services";
import { NewsItem } from "@/types";
import { FiCalendar, FiArrowRight } from "react-icons/fi";

function formatDate(date: Date | string) {
  const d = date instanceof Date ? date : (date as any)?.toDate?.() || new Date(date as string);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Fallback news for demo

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
     .then((d) => setNews(d))
.catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="news" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.04),transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-accent-cyan font-display text-xs tracking-widest mb-4">
            LATEST UPDATES
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            News & <span className="gradient-text">Insights</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-3 py-12">
            {[0, 1, 2].map((i) => (
              <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 neon-border product-card group"
              >
                <div className="flex items-center gap-2 text-text-secondary text-xs font-body mb-3">
                  <FiCalendar size={12} />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-white mb-3 leading-tight group-hover:text-accent-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-secondary font-body text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                <button className="flex items-center gap-2 text-accent-cyan text-xs font-display tracking-widest group-hover:gap-3 transition-all">
                  READ MORE <FiArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
