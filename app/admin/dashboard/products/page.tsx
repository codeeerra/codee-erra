"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from "@/firebase/services";
import { Product } from "@/types";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiStar } from "react-icons/fi";
import Image from "next/image";

const EMPTY: Omit<Product, "id" | "createdAt"> = {
  title: "", description: "", images: [], tags: [], featured: false,
};

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    getProducts().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
  if (!editing?.title || !editing.description) {
    toast.error("Title and description required");
    return;
  }

  setSaving(true);

  try {
    if (editing.id) {
      await updateProduct(editing.id, editing);
      toast.success("Product updated");
    } else {
      await addProduct({
        title: editing.title,
        description: editing.description,
        images: editing.images || [],
        tags: editing.tags || [],
        featured: editing.featured || false,
      } as any);

      toast.success("Product created");
    }

    setEditing(null);

    // instant refresh without hanging
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);

  } catch (error) {
    console.error(error);
    toast.error("Save failed");
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    toast.success("Deleted");
    load();
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !editing) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
       Array.from(files).map((f) => uploadImage(f))
      );
      setEditing((p) => ({ ...p, images: [...(p?.images || []), ...urls] }));
      toast.success("Images uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setEditing((p) => ({ ...p, tags: [...(p?.tags || []), tagInput.trim()] }));
    setTagInput("");
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Products</h1>
          <p className="text-text-secondary font-body mt-1">Manage your product showcase</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="neon-btn-filled px-5 py-3 rounded-lg font-display text-xs tracking-widest flex items-center gap-2">
          <FiPlus size={14} /> ADD PRODUCT
        </button>
      </div>

      {loading ? (
        <div className="flex gap-3 py-12 justify-center">
          {[0,1,2].map(i => <div key={i} className="loading-dot w-3 h-3 rounded-full bg-accent-cyan" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          {products.length === 0 && (
            <div className="glass rounded-xl p-12 text-center neon-border">
              <p className="text-text-secondary font-body">No products yet. Add your first product.</p>
            </div>
          )}
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 neon-border flex items-start gap-4"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-secondary border border-cyan-500/10 shrink-0">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.title} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">IMG</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-sm font-bold text-white truncate">{product.title}</h3>
                  {product.featured && <FiStar size={12} className="text-accent-cyan shrink-0" />}
                </div>
                <p className="text-text-secondary font-body text-sm line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags?.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-accent-cyan border border-cyan-500/20">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setEditing(product); setTagInput(""); }} className="p-2 rounded-lg border border-cyan-500/20 text-accent-cyan hover:bg-cyan-500/10 transition-all">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto neon-border"
            >
              <div className="sticky top-0 glass-dark border-b border-cyan-500/10 px-8 py-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold gradient-text">
                  {editing.id ? "Edit Product" : "New Product"}
                </h2>
                <button onClick={() => setEditing(null)} className="text-text-secondary hover:text-white p-2 rounded transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">TITLE *</label>
                  <input value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm" placeholder="Product title" />
                </div>
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">DESCRIPTION *</label>
                  <textarea value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4}
                    className="w-full cyber-input rounded-lg px-4 py-3 font-body text-sm resize-none" placeholder="Product description" />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">IMAGES</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {editing.images?.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-cyan-500/20">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          onClick={() => setEditing(p => ({ ...p, images: p?.images?.filter((_, i) => i !== idx) }))}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center"
                        >
                          <FiX size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-cyan-500/30 flex flex-col items-center justify-center gap-1 hover:border-accent-cyan transition-colors text-text-secondary hover:text-accent-cyan"
                    >
                      {uploading ? <div className="loading-dot w-2 h-2 rounded-full bg-accent-cyan" /> : <><FiUpload size={16} /><span className="text-xs">Upload</span></>}
                    </button>
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                    onChange={e => handleImageUpload(e.target.files)} />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-display tracking-widest text-text-secondary mb-2">TAGS</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editing.tags?.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-cyan-500/10 text-accent-cyan border border-cyan-500/20">
                        {t}
                        <button onClick={() => setEditing(p => ({ ...p, tags: p?.tags?.filter(x => x !== t) }))}>
                          <FiX size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()}
                      className="flex-1 cyber-input rounded-lg px-4 py-2 font-body text-sm" placeholder="Add tag..." />
                    <button onClick={addTag} className="neon-btn px-4 py-2 rounded-lg font-display text-xs">ADD</button>
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditing(p => ({ ...p, featured: !p?.featured }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${editing.featured ? "bg-accent-cyan" : "bg-gray-700"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${editing.featured ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm font-body text-text-secondary">Mark as Featured</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 neon-btn-filled py-3 rounded-lg font-display text-sm tracking-widest disabled:opacity-50"
                  >
                    {saving ? "SAVING..." : (editing.id ? "UPDATE" : "CREATE")}
                  </button>
                  <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-lg border border-gray-700 text-text-secondary font-display text-sm">
                    CANCEL
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
