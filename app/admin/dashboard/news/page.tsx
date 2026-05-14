"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNews, addNews, updateNews, deleteNews } from "@/firebase/services";
import { NewsItem } from "@/types";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar } from "react-icons/fi";

function formatDate(date: any) {
  const d = date?.toDate?.() || new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getNews().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing?.title || !editing.description) { toast.error("All fields required"); return; }
    setSaving(true);
    try {
      if (editing.id) { await updateNews(editing.id, editing); toast.success("Updated"); }
      else { await addNews({ title: editing.title, description: editing.description, createdAt: new Date() } as any); toast.success("Created"); }
      setEditing(null); load();
    } catch { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    await deleteNews(id); toast.success("Deleted"); load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Latest News</h1>
          <p className="text-text-secondary font-body mt-1">Manage news and updates shown on the homepage</p>
        </div>
        <button onClick={() => setEditing({ title: "", description: "" })} className="neon-btn-filled px-5 py-3 rounded-lg font-display text-xs tracking-widest flex items-center gap-2">
          <FiPlus size={14} /> ADD NEWS
        </button>
      </div>

      {loading ? (
        <div className="flex gap-3 py-12 justify-center">{[0,1,2].map(i => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}</div>
      ) : (
        <div className="space-y-4">
          {items.length === 0 && (
            <div className="glass rounded-xl p-12 text-center neon-border">
              <p className="text-text-secondary font-body">No news items yet.</p>
            </div>
          )}
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 neon-border"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-text-secondary font-body text-sm leading-relaxed mb-3">{item.description}</p>
                  <div className="flex items-center gap-2 text-text-secondary text-xs font-body">
                    <FiCalendar size={11} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(item)} className="p-2 rounded-lg border border-cyan-500/20 text-accent-cyan hover:bg-cyan-500/10 transition-all">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
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
                <h2 className="font-display text-lg font-bold gradient-text">{editing.id ? "Edit News" : "New News Item"}</h2>
                <button onClick={() => setEditing(null)} className="text-text-secondary hover:text-white p-2 rounded transition-colors"><FiX size={20} /></button>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">TITLE *</label>
                  <input value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="News headline" />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">DESCRIPTION *</label>
                  <textarea value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm resize-none" placeholder="News content..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 neon-btn-filled py-3 rounded-lg font-display text-sm tracking-widest disabled:opacity-50">
                    {saving ? "SAVING..." : (editing.id ? "UPDATE" : "PUBLISH")}
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
