"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getAboutContent } from "@/firebase/services";
import { AboutContent } from "@/types";

const FALLBACK: AboutContent = {
  companyInfo: "codee.erra is a next-generation technology company at the intersection of AI, software engineering, and human experience. We build systems that don't just solve today's problems—they anticipate tomorrow's challenges.",
  mission: "To democratize access to cutting-edge AI technology by building products that are powerful, intuitive, and transformative—empowering businesses and individuals to achieve the extraordinary.",
  vision: "A world where intelligent software seamlessly integrates into every aspect of human life, amplifying potential and enabling innovation without limits.",
  founderStory: "Born from a simple belief that software should be smarter, codee.erra was founded by a team of engineers and visionaries who refused to accept the status quo. Starting in a small lab, we grew into a global team united by passion for innovation and excellence.",
  images: [],
};





export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>(FALLBACK);

  useEffect(() => {
    getAboutContent()
      .then((d) => d && setContent(d))
      .catch(() => {});
  }, []);

  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-accent-cyan font-display text-xs tracking-widest mb-6">
              ABOUT US
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-white mb-6">
              Who We <span className="gradient-text">Are</span>
            </h1>
            <p className="text-text-secondary font-body text-xl leading-relaxed max-w-2xl mx-auto">
              {content.companyInfo}
            </p>
          </motion.div>
        </div>
      </section>

     
      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Mission", content: content.mission, icon: "◎" },
              { title: "Vision", content: content.vision, icon: "◈" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-10 neon-border"
              >
                <div className="text-4xl text-accent-cyan mb-4">{item.icon}</div>
                <h2 className="font-display text-2xl font-bold gradient-text mb-4">Our {item.title}</h2>
                <p className="text-text-secondary font-body text-lg leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 bg-bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-accent-cyan font-display text-xs tracking-widest mb-4">
              THE STORY
            </div>
            <h2 className="font-display text-4xl font-bold text-white">Founder's <span className="gradient-text">Journey</span></h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10 neon-border"
          >
            <div className="text-6xl text-accent-cyan/20 font-display font-black leading-none mb-4">"</div>
            <p className="text-text-secondary font-body text-xl leading-relaxed">{content.founderStory}</p>
          </motion.div>
        </div>
      </section>

     
      <Footer />
    </main>
  );
}
