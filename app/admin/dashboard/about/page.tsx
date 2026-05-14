"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAboutContent, updateAboutContent } from "@/firebase/services";
import toast from "react-hot-toast";

export default function AboutAdminPage() {
  const [form, setForm] = useState({
    companyInfo: "", mission: "", vision: "", founderStory: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAboutContent()
      .then(d => { if (d) setForm({ companyInfo: d.companyInfo, mission: d.mission, vision: d.vision, founderStory: d.founderStory }); })
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAboutContent(form as any);
      toast.success("About page updated");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex gap-3 py-12 justify-center">{[0,1,2].map(i => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}</div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">About Page</h1>
        <p className="text-text-secondary font-body mt-1">Edit your company story and information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {[
          { key: "companyInfo", label: "COMPANY INTRODUCTION", placeholder: "Who is codee.erra?", rows: 4 },
          { key: "mission", label: "MISSION STATEMENT", placeholder: "Your mission...", rows: 3 },
          { key: "vision", label: "VISION STATEMENT", placeholder: "Your vision...", rows: 3 },
          { key: "founderStory", label: "FOUNDER STORY", placeholder: "The story behind codee.erra...", rows: 6 },
        ].map(field => (
          <div key={field.key} className="glass rounded-xl p-6 neon-border">
            <label className="block text-xs font-display tracking-widest text-accent-cyan mb-3">{field.label}</label>
            <textarea
              value={(form as any)[field.key]}
              onChange={e => set(field.key, e.target.value)}
              rows={field.rows}
              className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm resize-none"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <button onClick={handleSave} disabled={saving}
          className="w-full neon-btn-filled py-4 rounded-xl font-display text-sm tracking-widest disabled:opacity-50">
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </motion.div>
    </div>
  );
}
