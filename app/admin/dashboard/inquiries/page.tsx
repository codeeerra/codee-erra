"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getInquiries, updateInquiry, deleteInquiry } from "@/firebase/services";
import { Inquiry } from "@/types";
import toast from "react-hot-toast";
import { FiMail, FiTrash2, FiX, FiPhone, FiBuilding, FiMessageSquare } from "react-icons/fi";

function formatDate(date: any) {
  const d = date?.toDate?.() || new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  contacted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function InquiriesAdminPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "closed">("all");

  const load = () => { setLoading(true); getInquiries().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: Inquiry["status"]) => {
    await updateInquiry(id, { status });
    toast.success("Status updated");
    load();
    if (selected?.id === id) setSelected(p => p ? { ...p, status } : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete inquiry?")) return;
    await deleteInquiry(id); toast.success("Deleted");
    setSelected(null); load();
  };

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);
  const counts = { all: items.length, new: items.filter(i => i.status === "new").length, contacted: items.filter(i => i.status === "contacted").length, closed: items.filter(i => i.status === "closed").length };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Inquiries</h1>
        <p className="text-text-secondary font-body mt-1">Customer inquiries and contact requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "new", "contacted", "closed"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-display text-xs tracking-widest transition-all border ${filter === f ? "bg-cyan-500/20 text-accent-cyan border-cyan-500/30" : "border-gray-700 text-text-secondary hover:border-gray-600"}`}>
            {f.toUpperCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex gap-3 py-12 justify-center">{[0,1,2].map(i => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="glass rounded-xl p-12 text-center neon-border"><p className="text-text-secondary font-body">No inquiries found.</p></div>
          )}
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(item)}
              className="glass rounded-xl p-5 neon-border cursor-pointer hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display text-sm font-bold text-white">{item.fullName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-display border ${STATUS_STYLES[item.status]}`}>{item.status.toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-body bg-bg-secondary text-text-secondary">{item.inquiryType}</span>
                  </div>
                  <p className="text-text-secondary font-body text-sm truncate">{item.email} {item.companyName ? `· ${item.companyName}` : ""}</p>
                  <p className="text-text-secondary font-body text-xs mt-1 line-clamp-1">{item.message}</p>
                </div>
                <div className="text-text-secondary text-xs font-body shrink-0 text-right">
                  {formatDate(item.createdAt)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto neon-border"
            >
              <div className="border-b border-cyan-500/10 px-8 py-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold gradient-text">Inquiry Detail</h2>
                <button onClick={() => setSelected(null)} className="text-text-secondary hover:text-white p-2 rounded"><FiX size={20} /></button>
              </div>
              <div className="p-8 space-y-5">
                {/* Contact info */}
                <div className="glass rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="font-display font-bold text-accent-cyan text-sm">{selected.fullName[0]}</span>
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-white">{selected.fullName}</div>
                      <div className="text-text-secondary text-xs">{formatDate(selected.createdAt)}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary"><FiMail size={12} /><span className="truncate">{selected.email}</span></div>
                    {selected.phone && <div className="flex items-center gap-2 text-text-secondary"><FiPhone size={12} /><span>{selected.phone}</span></div>}
                    {selected.companyName && <div className="flex items-center gap-2 text-text-secondary col-span-2"><FiBuilding size={12} /><span>{selected.companyName}</span></div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Product", value: selected.productName },
                    { label: "Budget", value: selected.budget },
                    { label: "Type", value: selected.inquiryType },
                    { label: "Status", value: selected.status },
                  ].filter(x => x.value).map(x => (
                    <div key={x.label} className="glass rounded-lg p-3">
                      <div className="text-xs font-display tracking-widest text-text-secondary mb-1">{x.label.toUpperCase()}</div>
                      <div className="text-sm font-body text-white capitalize">{x.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-display tracking-widest text-text-secondary mb-2"><FiMessageSquare size={11} /> MESSAGE</div>
                  <div className="glass rounded-xl p-4 text-text-secondary font-body text-sm leading-relaxed">{selected.message}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {(["new", "contacted", "closed"] as const).map(s => (
                    <button key={s} onClick={() => handleStatus(selected.id, s)}
                      className={`px-4 py-2 rounded-lg font-display text-xs tracking-widest transition-all border ${selected.status === s ? STATUS_STYLES[s] : "border-gray-700 text-text-secondary hover:border-gray-600"}`}>
                      MARK {s.toUpperCase()}
                    </button>
                  ))}
                  <button onClick={() => handleDelete(selected.id)}
                    className="ml-auto px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-display text-xs tracking-widest transition-all flex items-center gap-2">
                    <FiTrash2 size={12} /> DELETE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
