"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUpcomingProjects, addUpcomingProject, updateUpcomingProject, deleteUpcomingProject } from "@/firebase/services";
import { UpcomingProject } from "@/types";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const STATUS_OPTIONS = ["planning", "development", "testing", "launch"] as const;
const STATUS_COLORS: Record<string, string> = {
  planning: "text-slate-400 border-slate-500/30 bg-slate-500/10",
  development: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  testing: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  launch: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

export default function UpcomingAdminPage() {
  const [items, setItems] = useState<UpcomingProject[]>([]);
  const [editing, setEditing] = useState<Partial<UpcomingProject> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getUpcomingProjects().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.title || !editing.description) { toast.error("All fields required"); return; }
    setSaving(true);
    try {
      if (editing.id) { await updateUpcomingProject(editing.id, editing); toast.success("Updated"); }
      else { await addUpcomingProject({ title: editing.title, description: editing.description, status: editing.status || "planning", createdAt: new Date() } as any); toast.success("Created"); }
      setEditing(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await deleteUpcomingProject(id); toast.success("Deleted"); load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Upcoming Projects</h1>
          <p className="text-text-secondary font-body mt-1">Manage the product roadmap timeline</p>
        </div>
        <button onClick={() => setEditing({ title: "", description: "", status: "planning" })} className="neon-btn-filled px-5 py-3 rounded-lg font-display text-xs tracking-widest flex items-center gap-2">
          <FiPlus size={14} /> ADD PROJECT
        </button>
      </div>

      {loading ? (
        <div className="flex gap-3 py-12 justify-center">{[0,1,2].map(i => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}</div>
      ) : (
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="glass rounded-xl p-12 text-center neon-border"><p className="text-text-secondary font-body">No upcoming projects yet.</p></div>
          )}
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 neon-border flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-sm font-bold text-white">{item.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-display border ${STATUS_COLORS[item.status]}`}>{item.status.toUpperCase()}</span>
                </div>
                <p className="text-text-secondary font-body text-sm">{item.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(item)} className="p-2 rounded-lg border border-cyan-500/20 text-accent-cyan hover:bg-cyan-500/10 transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-dark rounded-2xl w-full max-w-lg neon-border"
            >
              <div className="border-b border-cyan-500/10 px-8 py-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold gradient-text">{editing.id ? "Edit Project" : "New Upcoming Project"}</h2>
                <button onClick={() => setEditing(null)} className="text-text-secondary hover:text-white p-2 rounded"><FiX size={20} /></button>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">TITLE *</label>
                  <input value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="Project name" />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">DESCRIPTION *</label>
                  <textarea value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={3}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm resize-none" placeholder="Project overview..." />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">STATUS</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => setEditing(p => ({ ...p, status: s }))}
                        className={`py-2 px-3 rounded-lg text-xs font-display tracking-wider transition-all border ${editing.status === s ? STATUS_COLORS[s] : "border-gray-700 text-text-secondary hover:border-gray-600"}`}>
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving} className="flex-1 neon-btn-filled py-3 rounded-lg font-display text-sm tracking-widest disabled:opacity-50">
                    {saving ? "SAVING..." : (editing.id ? "UPDATE" : "CREATE")}
                  </button>
                  <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-lg border border-gray-700 text-text-secondary font-display text-sm">CANCEL</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
